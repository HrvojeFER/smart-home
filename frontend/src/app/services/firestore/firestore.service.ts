import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';

import { NetworkData } from 'src/app/provider/abstractProvider';

import { Preset } from '../preset/preset.service';

import { PresetData, AdminData, ArduinoData } from '../user/user';
import { UserStatus } from '../user/user-status';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private readonly USER_COLLECTION = 'users';
  private readonly ARDUINO_COLLECTION = 'arduino';

  constructor(private firestore: AngularFirestore) {}

  public async CreateUser(uid: string, name: string): Promise<void> {
    await this.SetUserWithUid({ displayName: name } as FirestoreUser, uid);
  }
  public async GetUserPresets(ref: DocumentReference): Promise<Array<Preset>> {
    let user = {} as FirestoreUser;
    user = await this.GetUserFromRef(ref);

    if (user.preset) {
      if (user.preset.presets) {
        return user.preset.presets;
      }
      user.preset.presets = [];
      await this.SetUserWithRef(user, ref);
      return user.preset.presets;
    }
    user.preset = { presets: [] };
    await this.SetUserWithRef(user, ref);
    return user.preset.presets;
  }
  public async SetUserPresets(
    ref: DocumentReference,
    presets: Array<Preset>
  ): Promise<void> {
    const user: FirestoreUser = await this.GetUserFromRef(ref);
    if (user.preset) {
      user.preset.presets = presets;
    } else {
      user.preset = { presets };
    }
    await this.SetUserWithRef(user, ref);
  }
  public async GetUserDisplayName(ref: DocumentReference): Promise<string> {
    const user: FirestoreUser = await this.GetUserFromRef(ref);
    return user.displayName;
  }
  public async SetUserArduino(
    userRef: DocumentReference,
    arduinoRef: DocumentReference | null
  ) {
    let user: FirestoreUser = await this.GetUserFromRef(userRef);

    if (arduinoRef) {
      const arduino: FirestoreArduino = await this.GetArduinoFromRef(
        arduinoRef
      );

      if (arduino.admin) {
        if (arduino.admin.pending) {
          arduino.admin.pending.push(userRef.id);
        } else {
          arduino.admin.pending = [userRef.id];
        }
      } else {
        arduino.admin = { uid: userRef.id };
      }
      await this.SetArduinoWithRef(arduino, arduinoRef);

      user.arduinoRef = arduinoRef;
    } else {
      user = {
        displayName: user.displayName
      } as FirestoreUser;
    }

    await this.SetUserWithRef(user, userRef);
  }
  public SubscribeUserToArduinoChanges(
    arduinoRef: DocumentReference,
    arduinoData: ArduinoData
  ) {
    if (arduinoData.admin) {
      arduinoRef.onSnapshot({
        next: next => {
          arduinoData.admin.next((next.data() as FirestoreArduino).admin);
          arduinoData.network.next((next.data() as FirestoreArduino).network);
        }
      });
    } else {
      arduinoRef.onSnapshot({
        next: next =>
          arduinoData.network.next((next.data() as FirestoreArduino).network)
      });
    }
  }
  public async GetUserArduinoDocRef(
    userRef: DocumentReference
  ): Promise<DocumentReference | null> {
    const arduino = (await this.GetUserFromRef(userRef)).arduinoRef;
    return arduino ? arduino : null;
  }
  private async SetUserWithUid(
    user: FirestoreUser,
    uid: string
  ): Promise<void> {
    await this.GetUserDocRef(uid).set(Object.assign({}, user));
  }
  private async SetUserWithRef(
    user: FirestoreUser,
    ref: DocumentReference
  ): Promise<void> {
    await ref.set(Object.assign({}, user));
  }
  private async GetUserFromRef(ref: DocumentReference): Promise<FirestoreUser> {
    const obj = (await ref.get()).data();
    return obj as FirestoreUser;
  }
  public GetUserDocRef(uid: string): DocumentReference {
    const docRef: DocumentReference = this.firestore
      .collection(this.USER_COLLECTION)
      .doc(uid).ref;
    return docRef;
  }

  public async GetArduinoList(): Promise<Array<FirestoreArduino>> {
    return await this.firestore
      .collection(this.ARDUINO_COLLECTION)
      .get()
      .pipe(map(q => q.docs.map(doc => doc.data() as FirestoreArduino)))
      .toPromise();
  }

  public async GetArduinoName(ref: DocumentReference): Promise<string> {
    return ((await ref.get()).data() as FirestoreArduino).name;
  }
  public async GetArduinoAdminData(
    ref: DocumentReference
  ): Promise<AdminData | null> {
    const arduino: FirestoreArduino = await this.GetArduinoFromRef(ref);
    return arduino.admin ? arduino.admin : null;
  }
  public async GetArduinoNetworkData(
    ref: DocumentReference
  ): Promise<NetworkData> {
    return (await this.GetArduinoFromRef(ref)).network;
  }
  public async ApproveUser(
    uid: string,
    arduinoRef: DocumentReference
  ): Promise<void> {
    const arduino = await this.GetArduinoFromRef(arduinoRef);

    if (arduino.admin.users) {
      arduino.admin.users.push(uid);
    } else {
      arduino.admin.users = [uid];
    }
    const pendingUserIndex: number = arduino.admin.pending.indexOf(uid);
    arduino.admin.pending.splice(pendingUserIndex, pendingUserIndex + 1);

    await this.SetArduinoWithRef(arduino, arduinoRef);
  }
  public async BlockUser(
    uid: string,
    arduinoRef: DocumentReference
  ): Promise<void> {
    const arduino = await this.GetArduinoFromRef(arduinoRef);

    if (arduino.admin) {
      if (arduino.admin.blocked) {
        arduino.admin.blocked.push(uid);
      } else {
        arduino.admin.blocked = [uid];
      }
    }
    const pendingUserIndex: number = arduino.admin.pending.indexOf(uid);
    if (pendingUserIndex >= 0) {
      arduino.admin.pending.splice(pendingUserIndex, pendingUserIndex + 1);
    }
    const userIndex: number = arduino.admin.users.indexOf(uid);
    if (userIndex >= 0) {
      arduino.admin.users.splice(userIndex, userIndex + 1);
    }

    await this.SetArduinoWithRef(arduino, arduinoRef);
  }
  public async UnblockUser(
    uid: string,
    arduinoRef: DocumentReference
  ): Promise<void> {
    const arduino = await this.GetArduinoFromRef(arduinoRef);

    if (arduino.admin.pending) {
      arduino.admin.pending.push(uid);
    } else {
      arduino.admin.pending = [uid];
    }
    const blockedUserIndex: number = arduino.admin.blocked.indexOf(uid);
    arduino.admin.blocked.splice(blockedUserIndex, blockedUserIndex + 1);

    await this.SetArduinoWithRef(arduino, arduinoRef);
  }
  public async GetUserDisplayNameAdmin(uid: string): Promise<string> {
    return await this.GetUserDisplayName(await this.GetUserDocRef(uid));
  }
  public async ResetUserArduino(
    userRef: DocumentReference,
    arduinoRef: DocumentReference
  ): Promise<void> {
    const arduino = await this.GetArduinoFromRef(arduinoRef);

    if (arduino.admin.blocked) {
      const blockedUserIndex: number = arduino.admin.blocked.indexOf(
        userRef.id
      );
      if (blockedUserIndex >= 0) {
        arduino.admin.blocked.splice(blockedUserIndex, blockedUserIndex + 1);
      }
    }
    if (arduino.admin.pending) {
      const pendingUserIndex: number = arduino.admin.pending.indexOf(
        userRef.id
      );
      if (pendingUserIndex >= 0) {
        arduino.admin.pending.splice(pendingUserIndex, pendingUserIndex + 1);
      }
    }

    await this.SetArduinoWithRef(arduino, arduinoRef);
    await this.SetUserArduino(userRef, null);
    await this.SetUserPresets(userRef, []);
  }
  public async GetArduinoFromRef(
    ref: DocumentReference
  ): Promise<FirestoreArduino> {
    const obj = (await ref.get()).data();
    return obj as FirestoreArduino;
  }
  private async SetArduinoWithRef(
    arduino: FirestoreArduino,
    ref: DocumentReference
  ): Promise<void> {
    await ref.set(Object.assign({}, arduino));
  }
  public async GetArduinoDocRef(name: string): Promise<DocumentReference> {
    return await this.firestore
      .collection<FirestoreArduino>(this.ARDUINO_COLLECTION, col =>
        col.where('name', '==', name)
      )
      .get()
      .pipe(map(q => q.docs[0].ref))
      .toPromise();
  }

  public async SubscribeUserToStatusChanges(
    userRef: DocumentReference,
    userStatus: UserStatus
  ): Promise<UserStatus> {
    const user: FirestoreUser = await this.GetUserFromRef(userRef);
    this.onUserChange(user, userStatus);
    userRef.onSnapshot({
      next: snapshot =>
        this.onUserChange(snapshot.data() as FirestoreUser, userStatus)
    });

    if (user.arduinoRef) {
      const arduino: FirestoreArduino = await this.GetArduinoFromRef(
        user.arduinoRef
      );
      this.onArduinoChange(arduino, userStatus, userRef.id);
      user.arduinoRef.onSnapshot({
        next: snapshot =>
          this.onArduinoChange(
            snapshot.data() as FirestoreArduino,
            userStatus,
            userRef.id
          )
      });
    }

    return userStatus;
  }
  private onUserChange(user: FirestoreUser, userStatus: UserStatus): void {
    if (user.arduinoRef) {
      if (userStatus.value < UserStatus.pendingApproval) {
        userStatus.setStatus(UserStatus.pendingApproval);
      }
    } else {
      if (userStatus.value > UserStatus.emailVerified) {
        userStatus.setStatus(UserStatus.emailVerified);
      }
    }
  }
  private onArduinoChange(
    arduino: FirestoreArduino,
    userStatus: UserStatus,
    uid: string
  ): void {
    if (arduino.admin.uid === uid) {
      if (userStatus.value !== UserStatus.admin) {
        userStatus.setStatus(UserStatus.admin);
      }
    } else if (arduino.admin.pending.indexOf(uid) !== -1) {
      if (userStatus.value !== UserStatus.pendingApproval) {
        userStatus.setStatus(UserStatus.pendingApproval);
      }
    } else if (arduino.admin.users.indexOf(uid) !== -1) {
      if (userStatus.value !== UserStatus.approved) {
        userStatus.setStatus(UserStatus.approved);
      }
    } else if (arduino.admin.blocked.indexOf(uid) !== -1) {
      if (userStatus.value !== UserStatus.blocked) {
        userStatus.setStatus(UserStatus.blocked);
      }
    }
  }
}

export interface FirestoreArduino {
  name: string;
  network: NetworkData;
  admin?: AdminData;
}

export interface FirestoreUser {
  displayName: string;
  arduinoRef?: DocumentReference;
  preset?: PresetData;
}
