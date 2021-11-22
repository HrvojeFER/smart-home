import { SensorType, ControllerType } from './abstractProvider';

export enum Location {
  kitchen = 'Kuhinja',
  livingRoom = 'Dnevni boravak',
  bathRoom = 'Kupaona'
}

export const Units = {
  celsius: {
    name: 'Stupnjeva celzijusa',
    short: '°C'
  } as Unit,
  percent: {
    name: 'Posto',
    short: '%'
  } as Unit,
  oneToFiveHundred: {
    name: '/500',
    short: '/500'
  } as Unit
};

export interface Unit {
  name: string;
  short: string;
}

export enum Property {
  temperature = 'Temperatura',
  moisture = 'Vlaga',
  light = 'Osvjetljenje'
}

export enum Gender {
  male = 'male',
  female = 'female'
}

export const ControllerTypes = {
  lamp: {
    akuzativ: 'lampicu',
    gender: Gender.female,
    genitiv: 'lampice',
    name: 'Lampica'
  } as ControllerType,
  ventilator: {
    akuzativ: 'ventilator',
    gender: Gender.male,
    genitiv: 'ventilatora',
    name: 'Ventilator'
  } as ControllerType,
  heater: {
    akuzativ: 'grijač',
    gender: Gender.male,
    genitiv: 'grijača',
    name: 'Grijač'
  } as ControllerType
};

export const SensorTypes = {
  temperature: {
    name: 'Temperatura',
    genitiv: 'senzora temperature'
  } as SensorType,
  moisture: {
    name: 'Vlaga',
    genitiv: 'senzora vlage'
  } as SensorType,
  light: {
    name: 'Svjetlost',
    genitiv: 'senzora svjetlosti'
  } as SensorType
};
