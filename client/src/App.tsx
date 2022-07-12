import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useWalletConnect} from '@walletconnect/react-native-dapp';

import Home from './screens/home';
import Connect from './screens/connect';

function App() {
  const connector = useWalletConnect();

  return <View style={styles.rootView}>{connector.connected ? <Home /> : <Connect />}</View>;
}

const styles = StyleSheet.create({
  rootView: {flex: 1},
});

export default App;
