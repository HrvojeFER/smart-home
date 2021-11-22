import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  AdminService,
  ArduinoUser
} from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private approved: Observable<Array<ArduinoUser | null>>;
  private blocked: Observable<Array<ArduinoUser | null>>;
  private pending: Observable<Array<ArduinoUser | null>>;

  public get ApprovedAsync(): Observable<Array<ArduinoUser | null>> {
    return this.approved;
  }
  public get BlockedAsync(): Observable<Array<ArduinoUser | null>> {
    return this.blocked;
  }
  public get PendingAsync(): Observable<Array<ArduinoUser | null>> {
    return this.pending;
  }

  private approving: boolean;
  private unblocking: boolean;
  private blocking: boolean;

  public get Approving(): boolean {
    return this.approving;
  }
  public get Unblocking(): boolean {
    return this.unblocking;
  }
  public get Blocking(): boolean {
    return this.blocking;
  }

  constructor(public admin: AdminService) {
    this.approved = admin.getApproved();
    this.blocked = admin.getBlocked();
    this.pending = admin.getPending();
  }

  public async ApproveUser(uid: string): Promise<void> {
    this.approving = true;
    await this.admin.ApproveUser(uid);
    this.approving = false;
  }
  public async UnblockUser(uid: string): Promise<void> {
    this.unblocking = true;
    await this.admin.UnblockUser(uid);
    this.unblocking = false;
  }
  public async BlockUser(uid: string): Promise<void> {
    this.blocking = true;
    await this.admin.BlockUser(uid);
    this.blocking = false;
  }

  ngOnInit() {}
}
