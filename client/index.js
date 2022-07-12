import {AppRegistry, LogBox, Platform} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {withWalletConnect} from '@walletconnect/react-native-dapp';

if (Platform.OS !== 'web') {
  LogBox.ignoreLogs(['Require cycle: node_modules']);
}

import './shim';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerComponent(appName, () =>
  withWalletConnect(App, {
    redirectUrl: 'dapp://',
    storageOptions: {asyncStorage: AsyncStorage},
  }),
);
