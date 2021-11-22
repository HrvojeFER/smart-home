import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs';

import { PresetService, Preset } from './preset.service';
import { UserService } from '../user/user.service';

import { Provider } from '../../provider/abstractProvider';

interface ActivePreset {
  preset: Preset;
  subscriptions?: Array<Subscription>;
}

@Injectable({
  providedIn: 'root'
})
export class FirebasePresetService implements PresetService {
  private readonly ACTIVE_PRESETS_KEY = 'activePresets';
  private activePresets: Array<ActivePreset>;

  public get ActivePresets(): Array<Preset> {
    return this.activePresets.map(active => active.preset);
  }

  public get ActivePreset(): Preset | null {
    return (this.activePresets[0] && this.activePresets[0].preset) || null;
  }

  public get UserPresets(): Array<Preset> {
    return this.user.PresetData.presets;
  }

  constructor(private user: UserService, private provider: Provider) {
    const savedActivePresets: Preset[] | null = JSON.parse(
      localStorage.getItem(this.ACTIVE_PRESETS_KEY)
    );

    if (savedActivePresets) {
      this.activePresets = savedActivePresets
        .map((saved, index) => {
          if (this.IsStillActive(saved)) {
            return {
              preset: saved,
              subscriptions: this.GetControllerChangeSubscriptions(saved, index)
            } as ActivePreset;
          }
          return null;
        })
        .filter(saved => saved !== null);
      if (this.activePresets.length !== savedActivePresets.length) {
        localStorage.setItem(
          this.ACTIVE_PRESETS_KEY,
          JSON.stringify(this.activePresets)
        );
      }
    } else {
      this.activePresets = new Array<ActivePreset>();
    }
  }

  public async ActivatePreset(preset: Preset): Promise<void> {
    if (this.activePresets.length !== 0) {
      this.DeactivatePreset(0);
    }

    await this.provider.applyPreset(preset);

    this.activePresets.push({
      preset,
      subscriptions: this.GetControllerChangeSubscriptions(
        preset,
        this.activePresets.length
      )
    });
    localStorage.setItem(
      this.ACTIVE_PRESETS_KEY,
      JSON.stringify(this.activePresets.map(active => active.preset))
    );
  }

  public DeactivatePreset(index?: number): void {
    const presetToDeactivateIndex = index ? index : 0;

    this.activePresets[
      presetToDeactivateIndex
    ].subscriptions.forEach(subscription => subscription.unsubscribe());

    this.activePresets.splice(presetToDeactivateIndex, 1);
    localStorage.setItem(
      this.ACTIVE_PRESETS_KEY,
      JSON.stringify(this.activePresets)
    );
  }

  public async DeleteUserPreset(index: number): Promise<void> {
    const presetData = this.user.PresetData;
    const presets = presetData.presets;

    presets.splice(index, 1);

    presetData.presets = presets;
    await this.user.UpdatePresetData(presetData);
  }

  public async AddOrUpdateUserPreset(
    preset: Preset,
    index: number
  ): Promise<void> {
    const presetData = this.user.PresetData;
    const presets = presetData.presets;

    if (index !== -1) {
      presets[index] = preset;
    } else {
      presets.push(preset);
    }

    presetData.presets = presets;
    await this.user.UpdatePresetData(presetData);
  }

  private GetControllerChangeSubscriptions(
    preset: Preset,
    index: number
  ): Array<Subscription> {
    return preset.state.map(presetState =>
      this.provider.getControllerStatus(presetState.controller).subscribe({
        next: providerState => {
          if (providerState !== presetState.turnedOn) {
            this.DeactivatePreset(index);
          }
        }
      })
    );
  }

  private IsStillActive(preset: Preset) {
    for (const presetState of preset.state) {
      const providerState = this.provider.getControllerStatus(
        presetState.controller
      );
      if (providerState.value !== presetState.turnedOn) {
        return false;
      }
    }
    return true;
  }
}
