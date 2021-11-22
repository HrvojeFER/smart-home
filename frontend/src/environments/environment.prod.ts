import { constants } from './constants';

export const environment = {
  production: true,
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
