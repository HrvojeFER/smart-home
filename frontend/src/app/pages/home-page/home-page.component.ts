import { Component, OnInit } from '@angular/core';

import { Provider, Controller } from '../../provider/abstractProvider';
import { Location } from '../../provider/common';

import {
  PresetService,
  Preset,
  ControllerState
} from 'src/app/services/preset/preset.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public presetZaPrikazati: Preset;

  public currentLocation: Location;
  private statusChanging: Map<number, boolean>;

  constructor(public provider: Provider, public preset: PresetService) {
    this.presetZaPrikazati = { name: '', state: new Array<ControllerState>() };
    this.currentLocation = Location.bathRoom; // da ne bude undefined
    this.statusChanging = new Map<number, boolean>(
      this.provider.getControllers().map(controller => [controller.id, false])
    );
  }

  ngOnInit() {
    const slider: HTMLElement = document.querySelector('.items');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = x - startX; // scroll-fast
      slider.scrollLeft = scrollLeft - walk;
      console.log(walk);
    });
  }

  public trim(str?: string): string {
    return str ? str.replace(/\s/g, '') : '';
  }

  usporedi<T>(prvi: T, drugi: T) {
    return _.isEqual(prvi, drugi);
  }

  lokacijePreseta(preset: Preset) {
    const lokacije = new Set<string>();
    preset.state.forEach(controllerState => {
      lokacije.add(controllerState.controller.location);
    });
    return lokacije;
  }

  public GetControllerStatesForLocation(preset: Preset, location: Location) {
    return preset.state.filter(state => state.controller.location === location);
  }

  public ControllerChangeDeactivatesPreset(
    controller: Controller,
    preset: Preset,
    turnedOn: boolean
  ): boolean {
    const presetState = preset.state.find(
      state => state.controller.id === controller.id
    );
    if (presetState) {
      return presetState.turnedOn === turnedOn;
    }
    return false;
  }

  public Capitalize(str: string): string {
    return str[0].toUpperCase().concat(str.slice(1));
  }

  public async changeStatus(controller: Controller): Promise<void> {
    const timeout = setTimeout(
      () => this.statusChanging.set(controller.id, true),
      200
    );
    try {
      await this.provider.changeStatus(controller);
    } catch (error) {
      console.log(error);
    }
    clearTimeout(timeout);
    this.statusChanging.set(controller.id, false);
  }

  public getStatusChanging(controller: Controller): boolean {
    return this.statusChanging.get(controller.id);
  }

  print() {
    console.log(this.presetZaPrikazati);
  }
}
