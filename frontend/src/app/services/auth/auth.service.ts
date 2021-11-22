import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { auth, User } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public get AuthState(): Observable<User> {
    return this.afAuth.authState;
  }

  constructor(private afAuth: AngularFireAuth) {}

  public async SignIn(email: string, password: string): Promise<User> {
    return (await this.afAuth.auth.signInWithEmailAndPassword(email, password))
      .user;
  }

  public async SignUp(email: string, password: string): Promise<User> {
    const user: User = (
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    ).user;
    await this.SendVerificationMail();
    return user;
  }

  public async SignOut() {
    await this.afAuth.auth.signOut();
  }

  public async SendVerificationMail(): Promise<void> {
    await this.afAuth.auth.currentUser.sendEmailVerification();
  }

  public async SendPasswordResetEmail(email: string): Promise<void> {
    await this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public async ConfirmPasswordReset(
    code: string,
    password: string
  ): Promise<void> {
    await this.afAuth.auth.confirmPasswordReset(code, password);
  }

  public async GoogleAuth(): Promise<User> {
    return await this.AuthLogin(new auth.GoogleAuthProvider());
  }

  private async AuthLogin(provider: auth.AuthProvider): Promise<User> {
    return (await this.afAuth.auth.signInWithPopup(provider)).user;
  }
}
