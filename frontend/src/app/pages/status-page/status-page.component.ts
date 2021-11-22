import { Component, OnInit } from '@angular/core';

import {
  Controller,
  Provider
} from 'src/app/provider/abstractProvider';

@Component({
  selector: 'app-status-page',
  templateUrl: './status-page.component.html',
  styleUrls: ['./status-page.component.css']
})
export class StatusPageComponent implements OnInit {
  private statusChanging: Map<string, boolean>;

  constructor(public provider: Provider) {
    this.statusChanging = new Map<string, boolean>(
      this.provider
        .getControllers()
        .map(controller => [this.getControllerKey(controller), false])
    );
  }

  ngOnInit() {}

  public getStatusChanging(controller: Controller): boolean {
    return this.statusChanging.get(this.getControllerKey(controller));
  }
  public changeStatus(controller: Controller): void {
    const contreollerKey = this.getControllerKey(controller);

    this.statusChanging.set(contreollerKey, true);
    this.provider.changeStatus(controller).then(value => {
      this.statusChanging.set(contreollerKey, false);
    });
  }
  private getControllerKey(controller: Controller): string {
    return controller.id + controller.location + controller.property;
  }

  public trim(str?: string): string {
    return str ? str.replace(/\s/g, '') : '';
  }
}
