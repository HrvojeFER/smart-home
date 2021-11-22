import { environment } from '../../environments/environment';
import { constants } from '../../environments/constants';

import { Provider } from './abstractProvider';
import { ArduinoProvider } from './implementations/arduinoProvider';
import { WebServerProvider } from './implementations/webServerProvider';
import { FrontendDebugProvider } from './implementations/frontendDebugProvider';

export function providerFactory(
  arduinoProvider: ArduinoProvider,
  webServerProvider: WebServerProvider,
  frontendDebugProvider: FrontendDebugProvider
): Provider {
  let provider: Provider;

  switch (environment.provider) {
    case constants.PROVIDER.ARDUINO: {
      provider = arduinoProvider;
      break;
    }

    case constants.PROVIDER.WEB_SERVER: {
      provider = webServerProvider;
      break;
    }

    case constants.PROVIDER.FRONTEND_DEBUG: {
      provider = frontendDebugProvider;
      break;
    }

    default: {
      provider = frontendDebugProvider;
      break;
    }
  }

  return provider;
}
