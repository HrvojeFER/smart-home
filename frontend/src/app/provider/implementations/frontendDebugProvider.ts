import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Provider,
  Controller,
  Sensor,
  Query,
  PinData
} from '../abstractProvider';
import {
  Units,
  Location,
  Property,
  SensorTypes,
  ControllerTypes
} from '../common';
import { NetworkData } from '../abstractProvider';
import { Preset } from 'src/app/services/preset/preset.service';

const Sensors: Array<Sensor> = [
  {
    type: SensorTypes.temperature,
    id: 1,
    location: Location.kitchen,
    property: Property.temperature,
    unit: Units.celsius
  },
  {
    type: SensorTypes.light,
    id: 2,
    location: Location.kitchen,
    property: Property.light,
    unit: Units.oneToFiveHundred
  },
  {
    type: SensorTypes.moisture,
    id: 3,
    location: Location.kitchen,
    property: Property.moisture,
    unit: Units.percent
  },
  {
    type: SensorTypes.temperature,
    id: 4,
    location: Location.livingRoom,
    property: Property.temperature,
    unit: Units.celsius
  },
  {
    type: SensorTypes.light,
    id: 5,
    location: Location.livingRoom,
    property: Property.light,
    unit: Units.oneToFiveHundred
  },
  {
    type: SensorTypes.moisture,
    id: 6,
    location: Location.livingRoom,
    property: Property.moisture,
    unit: Units.percent
  },
  {
    type: SensorTypes.temperature,
    id: 7,
    location: Location.bathRoom,
    property: Property.temperature,
    unit: Units.celsius
  },
  {
    type: SensorTypes.light,
    id: 8,
    location: Location.bathRoom,
    property: Property.light,
    unit: Units.oneToFiveHundred
  },
  {
    type: SensorTypes.moisture,
    id: 9,
    location: Location.bathRoom,
    property: Property.moisture,
    unit: Units.percent
  }
];

const Controllers: Array<Controller> = [
  {
    id: 10,
    location: Location.kitchen,
    property: Property.temperature,
    type: ControllerTypes.heater
  },
  {
    id: 11,
    location: Location.kitchen,
    property: Property.light,
    type: ControllerTypes.lamp
  },
  {
    id: 12,
    location: Location.kitchen,
    property: Property.moisture,
    type: ControllerTypes.ventilator
  },
  {
    id: 13,
    location: Location.bathRoom,
    property: Property.temperature,
    type: ControllerTypes.heater
  },
  {
    id: 14,
    location: Location.bathRoom,
    property: Property.light,
    type: ControllerTypes.lamp
  },
  {
    id: 15,
    location: Location.bathRoom,
    property: Property.moisture,
    type: ControllerTypes.ventilator
  },
  {
    id: 16,
    location: Location.livingRoom,
    property: Property.temperature,
    type: ControllerTypes.heater
  },
  {
    id: 17,
    location: Location.livingRoom,
    property: Property.light,
    type: ControllerTypes.lamp
  }
];

const PinData: PinData = {
  controllers: Controllers,
  sensors: Sensors
};

@Injectable({
  providedIn: 'root'
})
export class FrontendDebugProvider extends Provider {
  private readonly DELAY_100_MS: number = 100;
  private readonly DELAY_10_S: number = 1000 * 10;
  private readonly DEFAULT_CONTROLLER_VALUE: boolean = false;

  private sensorStatus: Map<number, BehaviorSubject<number>>;
  private controllerStatus: Map<number, BehaviorSubject<boolean>>;

  constructor() {
    super();

    this.sensorStatus = new Map(
      this.getSensors().map(sensor => {
        const key = sensor.id;
        let value: number = JSON.parse(
          localStorage.getItem(key.toString())
        ) as number;
        value = typeof value === 'number' ? value : null;

        let subject: BehaviorSubject<number>;
        switch (sensor.unit) {
          case Units.celsius:
            subject = new BehaviorSubject<number>(
              value ? value : Math.floor(Math.random() * 5 + 20)
            );
            interval(this.DELAY_10_S).subscribe({
              next: () => {
                subject.next(Math.floor(Math.random() * 5 + 20));
                localStorage.setItem(
                  key.toString(),
                  JSON.stringify(subject.value)
                );
              }
            });
            break;
          case Units.oneToFiveHundred:
            subject = new BehaviorSubject<number>(
              value ? value : Math.floor(Math.random() * 10)
            );

            interval(this.DELAY_10_S).subscribe({
              next: () => {
                subject.next(Math.floor(Math.random() * 10));
                localStorage.setItem(
                  key.toString(),
                  JSON.stringify(subject.value)
                );
              }
            });
            break;
          case Units.percent:
            subject = new BehaviorSubject<number>(
              value ? value : Math.floor(Math.random() * 100)
            );

            interval(this.DELAY_10_S).subscribe({
              next: () => {
                subject.next(Math.floor(Math.random() * 100));
                localStorage.setItem(
                  key.toString(),
                  JSON.stringify(subject.value)
                );
              }
            });
            break;
        }

        return [key, subject];
      })
    );

    this.controllerStatus = new Map<number, BehaviorSubject<boolean>>(
      this.getControllers().map(controller => {
        const key = controller.id;
        let value: boolean = JSON.parse(localStorage.getItem(key.toString()));
        value =
          typeof value === 'boolean' ? value : this.DEFAULT_CONTROLLER_VALUE;

        const subject = new BehaviorSubject<boolean>(value);

        return [key, subject];
      })
    );
  }

  public getSensors(query?: Query): Array<Sensor> | null {
    let result = Sensors;

    if (query) {
      if (query.location) {
        result = result.filter(sensor => sensor.location === query.location);
      }
      if (query.property) {
        result = result.filter(sensor => sensor.property === query.property);
      }
    }

    return result !== [] ? result : null;
  }
  public getControllers(query?: Query): Array<Controller> | null {
    let result = Controllers;

    if (query) {
      if (query.location) {
        result = result.filter(
          controller => controller.location === query.location
        );
      }
      if (query.property) {
        result = result.filter(
          controller => controller.property === query.property
        );
      }
    }

    return result !== [] ? result : null;
  }

  public getSensorStatus(sensor: Sensor): BehaviorSubject<number> {
    return this.sensorStatus.get(sensor.id);
  }
  public getControllerStatus(controller: Controller): BehaviorSubject<boolean> {
    return this.controllerStatus.get(controller.id);
  }

  public async changeStatus(controller: Controller): Promise<void> {
    await this.wait(this.DELAY_100_MS);

    const statusSubject = this.controllerStatus.get(controller.id);
    statusSubject.next(!statusSubject.value);
    localStorage.setItem(
      controller.id.toString(),
      JSON.stringify(statusSubject.value)
    );
  }
  public async applyPreset(preset: Preset): Promise<void> {
    await this.wait(this.DELAY_100_MS);

    for (const controllerState of preset.state) {
      this.controllerStatus
        .get(controllerState.controller.id)
        .next(controllerState.turnedOn);
      localStorage.setItem(
        controllerState.controller.id.toString(),
        JSON.stringify(controllerState.turnedOn)
      );
    }
  }

  public async connect(network: BehaviorSubject<NetworkData>): Promise<void> {
    await this.wait(this.DELAY_100_MS);
    this.connected = true;
  }
  public async disconnect(): Promise<void> {
    await this.wait(this.DELAY_100_MS);
    this.connected = false;
  }

  private async wait(delay: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
