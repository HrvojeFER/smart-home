import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { map, first, concatMap, pluck } from 'rxjs/operators';
import { BehaviorSubject, timer, Subscription, Observable } from 'rxjs';

import {
  Provider,
  Sensor,
  Controller,
  Query,
  NetworkData,
  ControllerType,
  SensorType
} from '../abstractProvider';
import {
  Property,
  Location,
  ControllerTypes,
  SensorTypes,
  Units,
  Unit
} from '../common';

import { Preset } from 'src/app/services/preset/preset.service';

type ControllerStatusType = boolean;
type SensorStatusType = number;

interface ConfResponse {
  [key: string]: Array<{
    property: string;
    value: number;
    target: number;
  }>;
}

interface ArduinoSensorResponse {
  status: number;
}

interface ArduinoControllerResponse {
  status: boolean;
}

interface ArduinoSubject<T extends ControllerStatusType | SensorStatusType> {
  subject: BehaviorSubject<T>;
  subscription: Subscription;
}

@Injectable({
  providedIn: 'root'
})
export class ArduinoProvider extends Provider {
  private network: BehaviorSubject<NetworkData>;

  private readonly ROUTE_SEPARATOR = '/';
  private readonly CONF_ROUTE = '/conf';
  private readonly SIMPLE_REQUEST_HEADERS = {
    'Content-Type': 'text/plain'
  };

  private readonly DELAY_10_S: number = 1000 * 10;
  private readonly DELAY_2_S: number = 1000 * 2;

  private sensorSubjects: Map<number, ArduinoSubject<SensorStatusType>>;
  private controllerSubjects: Map<number, ArduinoSubject<ControllerStatusType>>;
  private sensors: Array<Sensor>;
  private controllers: Array<Controller>;

  private get arduinoServerUrl(): string {
    return (
      'http://' +
      (this.network.value.address
        ? this.network.value.address
        : this.network.value.ip + ':' + this.network.value.port)
    );
  }

  constructor(private httpClient: HttpClient) {
    super();
  }

  public getSensors(query?: Query): Array<Sensor> | null {
    let result = this.sensors;

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
    let result = this.controllers;

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

  public getSensorStatus(sensor: Sensor): BehaviorSubject<SensorStatusType> {
    return this.sensorSubjects.get(sensor.id).subject;
  }
  public getControllerStatus(
    controller: Controller
  ): BehaviorSubject<ControllerStatusType> {
    return this.controllerSubjects.get(controller.id).subject;
  }

  public async changeStatus(controller: Controller): Promise<void> {
    const status = await this.arduinoPost<ArduinoControllerResponse, null>(
      this.getRoute(controller),
      null
    )
      .pipe(first(), pluck('status'))
      .toPromise();
    this.controllerSubjects.get(controller.id).subject.next(status);
  }
  public async applyPreset(preset: Preset): Promise<void> {
    for (const controllerState of preset.state) {
      if (
        this.controllerSubjects.get(controllerState.controller.id).subject
          .value !== controllerState.turnedOn
      ) {
        await this.changeStatus(controllerState.controller);
      }
    }
  }

  public async connect(network: BehaviorSubject<NetworkData>): Promise<void> {
    this.network = network;

    const conf: ConfResponse = await this.arduinoGet<ConfResponse>(
      this.CONF_ROUTE
    ).toPromise();
    const parsed: Array<Sensor | Controller> = this.parseConfResponse(conf);

    this.sensors = new Array<Sensor>();
    this.controllers = new Array<Controller>();
    for (const sorc of parsed) {
      if ('unit' in sorc) {
        this.sensors.push(sorc);
      } else {
        this.controllers.push(sorc);
      }
    }

    this.sensorSubjects = new Map<number, ArduinoSubject<SensorStatusType>>(
      this.getSensors().map(sensor => {
        const key = sensor.id;

        const subject = new BehaviorSubject<SensorStatusType>(null);
        const subscription = timer(0, this.DELAY_10_S)
          .pipe(
            concatMap(() =>
              this.arduinoGet<ArduinoSensorResponse>(
                this.getRoute(sensor)
              ).pipe(first(), pluck('status'))
            )
          )
          .subscribe({
            next: value => subject.next(value)
          });

        return [
          key,
          {
            subject,
            subscription
          } as ArduinoSubject<SensorStatusType>
        ];
      })
    );

    this.controllerSubjects = new Map<
      number,
      ArduinoSubject<ControllerStatusType>
    >(
      this.getControllers().map(controller => {
        const key = controller.id;
        const subject = new BehaviorSubject<ControllerStatusType>(null);

        const subscription = timer(0, this.DELAY_2_S)
          .pipe(
            concatMap(() =>
              this.arduinoGet<ArduinoControllerResponse>(
                this.getRoute(controller)
              ).pipe(first(), pluck('status'))
            )
          )
          .subscribe({
            next: turnedOn => subject.next(turnedOn)
          });

        return [
          key,
          {
            subject,
            subscription
          } as ArduinoSubject<ControllerStatusType>
        ];
      })
    );

    this.connected = true;
  }
  private parseConfResponse(conf: ConfResponse): Array<Sensor | Controller> {
    let id = 0;
    const a = new Array<Sensor | Controller>();

    for (const [key, value] of Object.entries(conf)) {
      let location: Location;
      switch (key) {
        case Location.bathRoom:
          location = Location.bathRoom;
          break;
        case Location.kitchen:
          location = Location.kitchen;
          break;
        case Location.livingRoom:
          location = Location.livingRoom;
          break;
      }

      for (const obj of value) {
        let property: Property;
        let controllerType: ControllerType;
        let sensorType: SensorType;
        let unit: Unit;

        switch (obj.property) {
          case Property.light:
            property = Property.light;
            controllerType = ControllerTypes.lamp;
            sensorType = SensorTypes.light;
            unit = Units.oneToFiveHundred;
            break;
          case Property.moisture:
            property = Property.moisture;
            controllerType = ControllerTypes.ventilator;
            sensorType = SensorTypes.moisture;
            unit = Units.percent;
            break;
          case Property.temperature:
            property = Property.temperature;
            controllerType = ControllerTypes.heater;
            sensorType = SensorTypes.temperature;
            unit = Units.celsius;
            break;
        }

        a.push({
          id,
          location,
          property,
          type: sensorType,
          unit
        } as Sensor);
        id += 1;

        a.push({
          id,
          location,
          property,
          type: controllerType
        } as Controller);
        id += 1;
      }
    }

    return a;
  }
  public async disconnect(): Promise<void> {
    this.controllerSubjects.forEach(controllerSubject =>
      controllerSubject.subscription.unsubscribe()
    );
    this.sensorSubjects.forEach(sensorSubject =>
      sensorSubject.subscription.unsubscribe()
    );

    this.controllerSubjects = null;
    this.sensorSubjects = null;

    this.controllers = null;
    this.sensors = null;

    this.network = null;

    this.connected = false;
  }

  private getRoute(controllerOrSensor: Controller | Sensor): string {
    return (
      this.ROUTE_SEPARATOR +
      [
        controllerOrSensor.location,
        controllerOrSensor.property,
        'unit' in controllerOrSensor ? 'Sensor' : 'Controller'
      ].join(this.ROUTE_SEPARATOR)
    );
  }

  private arduinoGet<ResponseType>(route: string): Observable<ResponseType> {
    return this.httpClient.get<ResponseType>(this.arduinoServerUrl + route, {
      headers: this.SIMPLE_REQUEST_HEADERS
    });
  }
  private arduinoPost<ResponseType, BodyType>(
    route: string,
    body: BodyType
  ): Observable<ResponseType> {
    return this.httpClient.post<ResponseType>(
      this.arduinoServerUrl + route,
      body,
      {
        headers: this.SIMPLE_REQUEST_HEADERS
      }
    );
  }
}
