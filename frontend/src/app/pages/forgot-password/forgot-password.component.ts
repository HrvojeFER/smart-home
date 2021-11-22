import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  private email: string | null;
  public get Email(): string | null {
    return this.email;
  }

  private sendingEmail: boolean;
  public get SendingEmail(): boolean {
    return this.sendingEmail;
  }
  private sendingEmailFailed: boolean;
  public get SendingEmailFailed(): boolean {
    return this.sendingEmailFailed;
  }
  private emailSent: boolean;
  public get EmailSent(): boolean {
    return this.emailSent;
  }

  constructor(public user: UserService, public router: Router) {
    this.email = null;

    this.sendingEmail = false;
    this.emailSent = false;
    this.sendingEmailFailed = false;
  }

  ngOnInit() {}

  public async SendPasswordResetEmail(email: string) {
    this.sendingEmail = true;
    const success: boolean = await this.user.SendPasswordResetEmail(email);

    if (success) {
      this.sendingEmail = false;
      this.emailSent = true;
      this.email = email;
    } else {
      this.sendingEmail = false;
      this.sendingEmailFailed = true;
    }
  }

  public async ResendPasswordEmail() {
    this.sendingEmail = true;
    await this.user.SendPasswordResetEmail(this.email);
    this.sendingEmail = false;
  }

  public EmailChanged(): void {
    this.sendingEmailFailed = false;
  }
}
