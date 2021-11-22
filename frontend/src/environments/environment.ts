// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { constants } from './constants';

export const environment = {
  production: false,
  provider: constants.PROVIDER.ARDUINO,
  presets: constants.PRESETS.FIREBASE,
  firebase: {
    apiKey: 'AIzaSyDe4l2acAO99Ydq6W1yBBX5kDSPulEfKcM',
    authDomain: 'smart-home-14c25.firebaseapp.com',
    databaseURL: 'https://smart-home-14c25.firebaseio.com',
    projectId: 'smart-home-14c25',
    storageBucket: 'smart-home-14c25.appspot.com',
    messagingSenderId: '204526187574'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
