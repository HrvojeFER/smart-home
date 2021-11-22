import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Provider } from '../../provider/abstractProvider';
import * as _ from 'lodash';

import {
  PresetService,
  ControllerState,
  Preset
} from 'src/app/services/preset/preset.service';

@Component({
  selector: 'app-preset',
  templateUrl: './preset.component.html',
  styleUrls: ['./preset.component.css']
})
export class PresetComponent implements OnInit {
  public newPreset: Array<ControllerState>;
  public indexPresetState: Array<boolean>;
  public locations: Set<string>;
  public newPresetName: string;
  public JSON = JSON;
  indexPreseta: number;
  public presetZaIzbrisat: number;
  public aktivniPreset: boolean;
  presetNameFormControl: FormControl;

  constructor(public presetService: PresetService, public provider: Provider) {
    this.newPresetName = '';
    this.newPreset = new Array<ControllerState>();
    this.locations = new Set<string>();
    this.indexPresetState = new Array<boolean>();
    this.resetirajNoviPreset();
    this.presetNameFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(16)
    ]);
    this.aktivniPreset = false;
  }

  ngOnInit() {}

  postaviFalse(index: number) {
    this.newPreset[index].turnedOn = false;
  }

  resetirajNoviPreset() {
    this.newPreset = [];
    this.indexPresetState = [];
    const controllers = this.provider.getControllers();
    let controllerState: ControllerState;
    controllers.forEach(element => {
      controllerState = { controller: element, turnedOn: false };
      this.newPreset.push(controllerState);
      this.locations.add(element.location);
      this.indexPresetState.push(false);
    });
  }

  urediPreset(presetZaUredit: Preset, indexPreseta: number) {
    this.resetirajNoviPreset();
    let i = 0;
    this.newPreset.forEach(newPreset => {
      presetZaUredit.state.forEach(stateZaUredit => {
        if (this.usporedi(newPreset.controller, stateZaUredit.controller)) {
          this.indexPresetState[i] = true;
          if (stateZaUredit.turnedOn) {
            this.newPreset[i].turnedOn = true;
          }
        }
      });
      i++;
    });
    if (this.usporedi(presetZaUredit, this.presetService.ActivePreset)) {
      this.aktivniPreset = true;
    }
    this.presetNameFormControl.reset();
    this.presetNameFormControl.setValue(presetZaUredit.name);
    this.indexPreseta = indexPreseta;
  }

  dodajPreset(name: string) {
    const presetToSend = new Array<ControllerState>();
    for (let i = 0; i <= this.newPreset.length; i++) {
      if (this.indexPresetState[i]) {
        presetToSend.push(this.newPreset[i]);
      }
    }
    this.presetService.AddOrUpdateUserPreset(
      {
        name,
        state: presetToSend
      },
      this.indexPreseta
    );
    if (this.aktivniPreset) {
      this.presetService.ActivatePreset(
        this.presetService.UserPresets[this.indexPreseta]
      );
      this.aktivniPreset = false;
    }
    this.resetirajNoviPreset();
  }

  indexPresetaFunkcija(indexPreseta: number) {
    this.indexPreseta = indexPreseta;
    this.resetirajNoviPreset();
    this.presetNameFormControl.reset();
  }

  usporedi<T>(prvi: T, drugi: T): boolean {
    return _.isEqual(prvi, drugi);
  }
}
