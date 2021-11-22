import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SignInComponent {
  private signingIn: boolean;
  public get SigningIn(): boolean {
    return this.signingIn;
  }

  private signingInFailed: boolean;
  public get SigningInFailed(): boolean {
    return this.signingInFailed;
  }

  constructor(private user: UserService, public router: Router) {
    this.signingIn = false;
    this.signingInFailed = false;
  }

  public async SignIn(email: string, password: string) {
    this.signingIn = true;
    const success = await this.user.SignIn(email, password);

    if (success) {
      if (this.user.hasArduino) {
        await this.router.navigate(['home']);
      } else {
        await this.router.navigate(['arduino-conf']);
      }
      this.signingIn = true;
    } else {
      this.signingIn = false;
      this.signingInFailed = true;
    }
  }

  public FieldsModified(): void {
    this.signingInFailed = false;
  }
}
