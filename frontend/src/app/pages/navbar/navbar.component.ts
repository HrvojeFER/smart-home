import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private signingOut: boolean;
  private navigating: boolean;

  public get SigningOut(): boolean {
    return this.signingOut;
  }
  public get Navigating(): boolean {
    return this.navigating;
  }

  private sidebarOpen: boolean;
  public get SidebarOpen(): boolean {
    return this.sidebarOpen;
  }

  constructor(public user: UserService, public router: Router) {
    this.signingOut = false;
    this.navigating = false;
    this.sidebarOpen = false;
  }

  ngOnInit() {}

  public async SignOut() {
    this.sidebarOpen = false;
    this.signingOut = true;
    await this.user.SignOut();
    await this.router.navigate(['sign-in']);
    this.signingOut = false;
  }

  public async NavigateTo(route: string) {
    this.sidebarOpen = false;
    this.navigating = true;
    await this.router.navigate([route]);
    this.navigating = false;
  }

  public OpenSidebar(): void {
    this.sidebarOpen = true;
  }

  public CloseSidebar(): void {
    this.sidebarOpen = false;
  }
}
