import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { FirestoreService } from '../firestore/firestore.service';

import { UserService } from '../user/user.service';

export interface ArduinoUser {
  displayName: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public getBlocked(): Observable<Array<ArduinoUser> | null> {
    return this.user.ArduinoData.admin.pipe(
      concatMap(async admin => {
        if (admin.blocked) {
          const blocked: Array<ArduinoUser> = new Array<ArduinoUser>();

          for (const uid of admin.blocked) {
            blocked.push({
              displayName: await this.firestore.GetUserDisplayNameAdmin(uid),
              uid
            });
          }

          return blocked;
        }
        return null;
      })
    );
  }

  public getPending(): Observable<Array<ArduinoUser> | null> {
    return this.user.ArduinoData.admin.pipe(
      concatMap(async admin => {
        if (admin.pending) {
          const pending: Array<ArduinoUser> = new Array<ArduinoUser>();

          for (const uid of admin.pending) {
            pending.push({
              displayName: await this.firestore.GetUserDisplayNameAdmin(uid),
              uid
            });
          }

          return pending;
        }
        return null;
      })
    );
  }

  public getApproved(): Observable<Array<ArduinoUser> | null> {
    return this.user.ArduinoData.admin.pipe(
      concatMap(async admin => {
        if (admin.users) {
          const approved: Array<ArduinoUser> = new Array<ArduinoUser>();

          for (const uid of admin.users) {
            approved.push({
              displayName: await this.firestore.GetUserDisplayNameAdmin(uid),
              uid
            });
          }

          return approved;
        }
        return null;
      })
    );
  }

  constructor(private firestore: FirestoreService, private user: UserService) {}

  public async ApproveUser(uid: string): Promise<void> {
    await this.firestore.ApproveUser(uid, this.user.ArduinoData.ref);
  }

  public async BlockUser(uid: string): Promise<void> {
    await this.firestore.BlockUser(uid, this.user.ArduinoData.ref);
  }

  public async UnblockUser(uid: string): Promise<void> {
    await this.firestore.UnblockUser(uid, this.user.ArduinoData.ref);
  }
}
