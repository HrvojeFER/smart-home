import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
  private signingUp: boolean;
  public get SigningUp() {
    return this.signingUp;
  }

  private signingUpFailed: boolean;
  public get SigningUpFailed(): boolean {
    return this.signingUpFailed;
  }

  constructor(private user: UserService, public router: Router) {
    this.signingUp = false;
    this.signingUpFailed = false;
  }

  public async SignUp(email: string, password: string, displayName: string) {
    this.signingUp = true;
    const success: boolean = await this.user.SignUp(
      email,
      password,
      displayName
    );

    if (success) {
      await this.router.navigate(['verify-email']);
      this.signingUp = false;
    } else {
      this.signingUp = false;
      this.signingUpFailed = true;
    }
  }

  public FieldsModified(): void {
    this.signingUpFailed = false;
  }
}
