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
export class UserGuard implements CanActivate {
  constructor(public user: UserService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.user.loggedIn) {
      this.router.navigate(['sign-in']);
    }

    return true;
  }
}
