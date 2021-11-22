import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private sendingEmail: boolean;
  public get SendingEmail(): boolean {
    return this.sendingEmail;
  }

  private sendingEmailFailed: boolean;
  public get SendingEmailFailed(): boolean {
    return this.sendingEmailFailed;
  }

  private readonly EMAIL_SENT_DELAY: number = 1000 * 15;
  private emailSent: boolean;
  public get EmailSent(): boolean {
    return this.emailSent;
  }

  private resettingArduino: boolean;
  public get ResettingArduino() {
    return this.resettingArduino;
  }

  public get DisplayName(): string {
    return this.user.DisplayName;
  }

  public get Email(): string {
    return this.user.Email;
  }

  public get IsAdmin(): boolean {
    return this.user.isAdmin;
  }

  public get HasArduino(): boolean {
    return this.user.hasArduino;
  }

  public get ArduinoName(): string {
    return this.user.ArduinoData.name;
  }

  constructor(private user: UserService, private router: Router) {
    this.sendingEmail = false;
    this.sendingEmailFailed = false;
    this.emailSent = false;

    this.resettingArduino = false;
  }

  public async SendPasswordResetEmail() {
    this.sendingEmailFailed = false;
    this.sendingEmail = true;
    const success: boolean = await this.user.SendPasswordResetEmail(
      this.user.Email
    );

    if (success) {
      this.sendingEmail = false;
      this.emailSent = true;
      setTimeout(() => (this.emailSent = false), this.EMAIL_SENT_DELAY);
    } else {
      this.sendingEmail = false;
      this.sendingEmailFailed = true;
    }
  }

  public async ResetArduino() {
    this.resettingArduino = true;
    await this.user.ResetArduino();
    await this.router.navigate(['arduino-conf']);
    this.resettingArduino = false;
  }

  ngOnInit() {}
}
