import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Provider, Sensor, Controller, Query } from '../abstractProvider';
import { NetworkData } from '../abstractProvider';
import { Preset } from 'src/app/services/preset/preset.service';

@Injectable({
  providedIn: 'root'
})
export class WebServerProvider extends Provider {
  constructor() {
    super();
  }

  public getSensors: (query: Query) => Array<Sensor> | null;
  public getControllers: (query: Query) => Array<Controller> | null;

  public getSensorStatus: (sensor: Sensor) => BehaviorSubject<number>;
  public getControllerStatus: (
    controller: Controller
  ) => BehaviorSubject<boolean>;

  public changeStatus: (controller: Controller) => Promise<void>;
  public applyPreset: (preset: Preset) => Promise<void>;

  public connect: (network: BehaviorSubject<NetworkData>) => Promise<void>;
  public disconnect: () => Promise<void>;
}
