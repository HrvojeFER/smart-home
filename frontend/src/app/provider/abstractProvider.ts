import { BehaviorSubject } from 'rxjs';

import { Location, Property, Unit, Gender } from './common';
import { Preset } from '../services/preset/preset.service';

export interface Sensor {
  id: number;
  type: SensorType;
  property: Property;
  location: Location;
  unit: Unit;
}

export interface SensorType {
  name: string;
  genitiv: string;
}

export interface Controller {
  id: number;
  property: Property;
  location: Location;
  type: ControllerType;
}

export interface ControllerType {
  name: string;
  genitiv: string;
  akuzativ: string;
  gender: Gender;
}

export interface PinData {
  sensors: Array<Sensor>;
  controllers: Array<Controller>;
}

export interface Query {
  location?: Location;
  property?: Property;
}

export interface NetworkData {
  ip?: string;
  port?: string;
  address?: string;
}

export abstract class Provider {
  protected connected: boolean;
  public get Connected(): boolean {
    return this.connected;
  }

  public getLocations(
    pins: Array<{ property: Property; location: Location }>,
    property?: Property
  ): Array<string> {
    if (property) {
      return pins
        .filter(sensor => sensor.property === property)
        .map(sensor => sensor.location)
        .filter((elem, index, self) => {
          return index === self.indexOf(elem);
        });
    }

    return pins
      .map(sensor => sensor.location)
      .filter((elem, index, self) => {
        return index === self.indexOf(elem);
      });
  }

  public getProperties(
    pins: Array<{ property: Property; location: Location }>,
    location?: Location
  ): Array<string> {
    if (location) {
      return pins
        .filter(sensor => sensor.location === location)
        .map(sensor => sensor.property)
        .filter((elem, index, self) => {
          return index === self.indexOf(elem);
        });
    }

    return pins
      .map(sensor => sensor.property)
      .filter((elem, index, self) => {
        return index === self.indexOf(elem);
      });
  }

  public getStatus(gender: Gender, turnedOn: boolean) {
    if (turnedOn) {
      switch (gender) {
        case Gender.male:
          return 'upaljen';
        case Gender.female:
          return 'upaljena';
      }
    } else {
      switch (gender) {
        case Gender.male:
          return 'ugašen';
        case Gender.female:
          return 'ugašena';
      }
    }
  }

  public abstract getSensors(query?: Query): Array<Sensor> | null;
  public abstract getControllers(query?: Query): Array<Controller> | null;

  public abstract getSensorStatus(sensor: Sensor): BehaviorSubject<number>;
  public abstract getControllerStatus(
    controller: Controller
  ): BehaviorSubject<boolean>;

  public abstract changeStatus(controller: Controller): Promise<void>;
  public abstract applyPreset(preset: Preset): Promise<void>;

  public abstract connect(network: BehaviorSubject<NetworkData>): Promise<void>;
  public abstract disconnect(): Promise<void>;
}
