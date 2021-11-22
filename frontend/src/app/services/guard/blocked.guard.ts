import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { Observable } from 'rxjs';

import { UserService } from '../user/user.service';
import { UserStatus } from '../user/user-status';

@Injectable({
  providedIn: 'root'
})
export class BlockedGuard implements CanActivate {
  constructor(public user: UserService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    switch (this.user.UserStatus.value) {
      case UserStatus.admin:
        this.router.navigate(['home']);
        break;
      case UserStatus.approved:
        this.router.navigate(['home']);
        break;
      case UserStatus.blocked:
        break;
      case UserStatus.pendingApproval:
        this.router.navigate(['pending']);
        break;
      case UserStatus.emailVerified:
        this.router.navigate(['arduino-conf']);
        break;
      case UserStatus.loggedIn:
        this.router.navigate(['verify-email']);
        break;
      default:
        this.router.navigate(['sign-in']);
        break;
    }

    return true;
  }
}
