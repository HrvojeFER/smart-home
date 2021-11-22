import { User } from 'firebase';
import { DocumentReference } from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';

import { Preset } from '../preset/preset.service';
import { NetworkData } from 'src/app/provider/abstractProvider';

export type DataType = User | FirestoreData | PresetData | ArduinoData | null;

export class AppUser {
  private readonly AUTH_DATA_KEY = 'authData';

  private data: AppUserData;

  public get Data(): AppUserData {
    return this.data;
  }

  public updateData(...dataArray: Array<DataType>): void {
    for (const data of dataArray) {
      if (data === null) {
        this.data = { auth: null };
        localStorage.setItem(
          this.AUTH_DATA_KEY,
          JSON.stringify(this.data.auth)
        );
      } else if ('preset' in data) {
        this.data.firestore = data;
      } else if ('uid' in data) {
        this.data = {
          auth: {
            email: data.email,
            emailVerified: data.emailVerified,
            uid: data.uid
          } as AuthData
        } as AppUserData;
        if (data.emailVerified) {
          localStorage.setItem(
            this.AUTH_DATA_KEY,
            JSON.stringify(this.data.auth)
          );
        }
      } else if ('presets' in data) {
        this.data.firestore.preset = data;
      } else if ('network' in data) {
        this.data.firestore.arduino = data;
      }
    }
  }

  constructor() {
    let auth = JSON.parse(localStorage.getItem(this.AUTH_DATA_KEY)) as AuthData;
    auth = typeof auth === 'object' ? (auth ? auth : null) : null;
    this.data = { auth };
  }
}

export interface AppUserData {
  auth: AuthData;
  firestore?: FirestoreData;
}

export interface AuthData {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export interface FirestoreData {
  displayName: string;
  ref: DocumentReference;
  arduino?: ArduinoData;
  preset: PresetData;
}

export interface ArduinoData {
  name: string;
  ref: DocumentReference;
  admin?: BehaviorSubject<AdminData>;
  network: BehaviorSubject<NetworkData>;
}

export interface AdminData {
  uid: string;
  users?: Array<string>;

  pending?: Array<string>;
  blocked?: Array<string>;
}

export interface PresetData {
  presets: Array<Preset>;
}
