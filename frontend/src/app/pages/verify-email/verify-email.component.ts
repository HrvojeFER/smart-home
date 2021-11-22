import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  private emailSentAgain: boolean;
  private sendingEmail: boolean;

  public get Email() {
    return this.user.AuthData.email;
  }

  public get EmailSentAgain() {
    return this.emailSentAgain;
  }
  public get SendingEmail() {
    return this.sendingEmail;
  }

  constructor(private user: UserService) {}

  public async sendEmailAgain(): Promise<void> {
    this.sendingEmail = true;
    await this.user.SendVerificationEmail();
    this.sendingEmail = false;
    this.emailSentAgain = true;
  }

  ngOnInit() {}
}
