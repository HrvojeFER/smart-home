import { environment } from '../../../environments/environment';
import { constants } from '../../../environments/constants';

import { PresetService } from './preset.service';
import { FirebasePresetService } from './firebasePreset.service';

export function presetFactory(
  firebasePresetService: FirebasePresetService
): PresetService {
  let presetService: PresetService;

  switch (environment.provider) {
    case constants.PRESETS.FIREBASE: {
      presetService = firebasePresetService;
      break;
    }

    default: {
      presetService = firebasePresetService;
      break;
    }
  }

  return presetService;
}
