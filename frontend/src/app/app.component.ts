import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './services/user/user.service';
import { UserStatus } from './services/user/user-status';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private initialized: boolean;
  public get Initialized() {
    return this.initialized;
  }

  constructor(private user: UserService, private router: Router) {
    this.initialized = false;
  }

  ngOnInit(): void {
    this.user.init().then(() => (this.initialized = true));

    this.user.UserStatus.subscribe({
      next: status => {
        switch (status) {
          case UserStatus.admin:
            this.router.navigate(['admin']);
            break;
          case UserStatus.approved:
            this.router.navigate(['home']);
            break;
          case UserStatus.blocked:
            this.router.navigate(['blocked']);
            break;
          case UserStatus.pendingApproval:
            this.router.navigate(['pending']);
        }
      }
    });
  }
}
