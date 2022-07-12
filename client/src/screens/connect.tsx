import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {useAsyncCallback} from 'react-async-hook';
import {useWalletConnect} from '@walletconnect/react-native-dapp';

function Connect() {
  const connector = useWalletConnect();

  const connect = useAsyncCallback(async () => {
    try {
      const sessionStatus = await connector.connect();
      console.log({sessionStatus});
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <View style={styles.rootView}>
      <Button title="Connect" onPress={connect.execute} />
    </View>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Connect;
