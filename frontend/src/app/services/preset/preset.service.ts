import { Controller } from 'src/app/provider/abstractProvider';

export interface ControllerState {
  controller: Controller;
  turnedOn: boolean;
}

export interface Preset {
  name: string;
  state: Array<ControllerState>;
}

export abstract class PresetService {
  public abstract get UserPresets(): Array<Preset>;
  public abstract get ActivePresets(): Array<Preset>;
  public abstract get ActivePreset(): Preset;

  public abstract ActivatePreset(preset: Preset): Promise<void>;

  public abstract DeleteUserPreset(index: number): Promise<void>;
  public abstract AddOrUpdateUserPreset(
    preset: Preset,
    index: number
  ): Promise<void>;
}
