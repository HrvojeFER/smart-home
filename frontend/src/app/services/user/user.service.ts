import { Injectable } from '@angular/core';

import { User } from 'firebase';
import { DocumentReference } from '@angular/fire/firestore';

import {
  AppUser,
  ArduinoData,
  PresetData,
  FirestoreData,
  AdminData,
  AuthData
} from './user';
import { UserStatus } from './user-status';

import { AuthService } from '../auth/auth.service';
import {
  FirestoreService,
  FirestoreArduino
} from '../firestore/firestore.service';

import { NetworkData, Provider } from 'src/app/provider/abstractProvider';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private appUser: AppUser;
  private userStatus: UserStatus;

  public get UserStatus(): UserStatus {
    return this.userStatus;
  }

  public get isAdmin(): boolean {
    return this.userStatus.value >= UserStatus.admin;
  }

  public get approved(): boolean {
    return this.userStatus.value >= UserStatus.approved;
  }

  public get pendingApproval(): boolean {
    return this.userStatus.value >= UserStatus.pendingApproval;
  }
  public get blocked(): boolean {
    return this.userStatus.value >= UserStatus.blocked;
  }
  public get hasArduino(): boolean {
    return this.userStatus.value >= UserStatus.pendingApproval;
  }

  public get emailVerified(): boolean {
    return this.userStatus.value >= UserStatus.emailVerified;
  }
  public get loggedIn(): boolean {
    return this.userStatus.value >= UserStatus.loggedIn;
  }

  public get PresetData(): PresetData | null {
    if (this.approved || this.isAdmin) {
      return this.appUser.Data.firestore.preset;
    }

    return null;
  }

  public get ArduinoData(): ArduinoData | null {
    if (this.hasArduino) {
      return this.appUser.Data.firestore.arduino;
    }
    return null;
  }

  public get NetworkData(): BehaviorSubject<NetworkData> | null {
    if (this.hasArduino) {
      return this.appUser.Data.firestore.arduino.network;
    }

    return null;
  }

  public get DisplayName(): string | null {
    if (this.loggedIn) {
      return this.appUser.Data.firestore.displayName;
    }

    return null;
  }

  public get Email(): string | null {
    if (this.loggedIn) {
      return this.appUser.Data.auth.email;
    }

    return null;
  }

  public get AuthData(): AuthData | null {
    if (this.loggedIn) {
      return this.appUser.Data.auth;
    }

    return null;
  }

  private get Ref(): DocumentReference | null {
    if (this.loggedIn) {
      return this.appUser.Data.firestore.ref;
    }

    return null;
  }

  constructor(
    private auth: AuthService,
    private firestore: FirestoreService,
    private provider: Provider
  ) {
    this.appUser = new AppUser();
    this.userStatus = new UserStatus(UserStatus.null);
  }

  public async init() {
    this.userStatus.setStatus(UserStatus.initialized);
    if (this.appUser.Data.auth) {
      if (this.appUser.Data.auth.emailVerified) {
        this.userStatus.setStatus(UserStatus.emailVerified);
      } else {
        this.userStatus.setStatus(UserStatus.loggedIn);
      }

      await this.SetUpFirestoreUser(this.appUser.Data.auth.uid);
      if (this.NetworkData) {
        await this.provider.connect(this.NetworkData);
      }
    }
  }

  public async UpdatePresetData(preset: PresetData): Promise<void> {
    this.appUser.updateData(preset);
    await this.firestore.SetUserPresets(this.Ref, preset.presets);
  }

  public async SetArduino(name: string): Promise<void> {
    const arduinoRef: DocumentReference = await this.firestore.GetArduinoDocRef(
      name
    );
    const arduino: FirestoreArduino = await this.firestore.GetArduinoFromRef(
      arduinoRef
    );

    if (!arduino.admin) {
      const admin: AdminData = { uid: this.AuthData.uid };
      this.appUser.updateData({
        name: arduino.name,
        network: new BehaviorSubject(arduino.network),
        ref: arduinoRef,
        admin: new BehaviorSubject(admin)
      } as ArduinoData);
      this.userStatus.setStatus(UserStatus.admin);
    } else {
      this.appUser.updateData({
        network: new BehaviorSubject(arduino.network),
        ref: arduinoRef,
        name: arduino.name
      } as ArduinoData);
      this.userStatus.setStatus(UserStatus.pendingApproval);
    }

    this.firestore.SubscribeUserToArduinoChanges(this.Ref, this.ArduinoData);
    await this.firestore.SetUserArduino(this.Ref, this.ArduinoData.ref);
    await this.provider.connect(this.appUser.Data.firestore.arduino.network);
  }

  public async ResetArduino(): Promise<void> {
    await this.firestore.ResetUserArduino(this.Ref, this.ArduinoData.ref);
    let firestoreData = this.appUser.Data.firestore;
    firestoreData = {
      displayName: firestoreData.displayName,
      preset: { presets: [] },
      ref: firestoreData.ref
    } as FirestoreData;
    this.appUser.updateData(firestoreData);
    await this.provider.disconnect();
  }

  public async SignIn(email: string, password: string): Promise<boolean> {
    try {
      const user: User = await this.auth.SignIn(email, password);

      if (user.emailVerified) {
        this.userStatus.setStatus(UserStatus.emailVerified);
      } else {
        this.userStatus.setStatus(UserStatus.loggedIn);
      }

      await this.SetUpUser(user);

      return true;
    } catch (error) {
      return false;
    }
  }

  public async SignUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<boolean> {
    try {
      const user: User = await this.auth.SignUp(email, password);
      await this.firestore.CreateUser(user.uid, displayName);
      this.userStatus.setStatus(UserStatus.loggedIn);
      await this.SetUpUser(user);
      return true;
    } catch {
      return false;
    }
  }

  public async SignOut(): Promise<boolean> {
    try {
      await this.auth.SignOut();

      this.appUser.updateData(null);

      this.userStatus = new UserStatus(UserStatus.initialized);

      if (this.provider.Connected) {
        await this.provider.disconnect();
      }

      return true;
    } catch {
      return false;
    }
  }

  public async SendVerificationEmail(): Promise<boolean> {
    try {
      await this.auth.SendVerificationMail();
      return true;
    } catch {
      return false;
    }
  }

  public async SendPasswordResetEmail(email: string): Promise<boolean> {
    try {
      await this.auth.SendPasswordResetEmail(email);
      return true;
    } catch {
      return false;
    }
  }

  public async ResetPassword(code: string, password: string): Promise<boolean> {
    try {
      await this.auth.ConfirmPasswordReset(code, password);
      return true;
    } catch {
      return false;
    }
  }

  private async SetUpUser(user: User) {
    this.appUser.updateData(user);
    await this.SetUpFirestoreUser(user.uid);
    if (this.NetworkData) {
      if (this.provider.Connected) {
        await this.provider.disconnect();
      }
      await this.provider.connect(this.NetworkData);
    }
  }

  private async SetUpFirestoreUser(uid: string) {
    const userFirestoreRef: DocumentReference = this.firestore.GetUserDocRef(
      uid
    );
    const userPresetData: PresetData = {
      presets: await this.firestore.GetUserPresets(userFirestoreRef)
    };

    const arduinoRef: DocumentReference = await this.firestore.GetUserArduinoDocRef(
      userFirestoreRef
    );
    let arduino: FirestoreArduino;
    if (arduinoRef) {
      arduino = await this.firestore.GetArduinoFromRef(arduinoRef);
    }

    this.appUser.updateData({
      displayName: await this.firestore.GetUserDisplayName(userFirestoreRef),
      ref: userFirestoreRef,
      preset: userPresetData,
      arduino: arduino
        ? {
            network: new BehaviorSubject(arduino.network),
            ref: arduinoRef,
            admin: arduino.admin ? new BehaviorSubject(arduino.admin) : null,
            name: arduino.name
          }
        : null
    } as FirestoreData);

    await this.firestore.SubscribeUserToStatusChanges(
      this.Ref,
      this.userStatus
    );
    if (this.ArduinoData) {
      this.firestore.SubscribeUserToArduinoChanges(
        this.ArduinoData.ref,
        this.ArduinoData
      );
    }
  }
}
