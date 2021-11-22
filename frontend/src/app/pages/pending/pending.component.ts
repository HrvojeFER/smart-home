import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {
  private resetting: boolean;

  public get Resetting() {
    return this.resetting;
  }

  public get ArduinoName() {
    return this.user.ArduinoData.name;
  }

  constructor(private user: UserService, private router: Router) {
    this.resetting = false;
  }

  ngOnInit() {}

  public async ResetArduino() {
    this.resetting = true;
    await this.user.ResetArduino();
    await this.router.navigate(['arduino-conf']);
    this.resetting = false;
  }
}
