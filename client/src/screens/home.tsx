import React, {useCallback, useMemo, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert} from 'react-native';
import {useAsync, useAsyncCallback} from 'react-async-hook';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
// @ts-ignore
import {INFURA_ID} from 'react-native-dotenv';

import Web3 from 'web3';

import artifact from '../contracts/Storage.json';

interface IState {
  web3: Web3;
  accounts: string[];
  networkID: number;
  contract: import('web3-eth-contract').Contract;
}

function Home() {
  const [state, setState] = useState<IState>();
  const [storageValue, setStorageValue] = useState<string>();
  const [inputValue, onInputValueChange] = React.useState<string>();

  const connector = useWalletConnect();

  const provider = useMemo(() => {
    return new WalletConnectProvider({infuraId: INFURA_ID, connector, qrcode: false});
  }, [connector]);

  const init = useCallback(async () => {
    await provider.enable();
    // @ts-expect-error
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const networkID = await web3.eth.net.getId();
    // @ts-expect-error
    const address = artifact.networks[networkID].address;
    // @ts-expect-error
    const contract = new web3.eth.Contract(artifact.abi, address);

    setState({web3, accounts, networkID, contract});
  }, [provider]);

  useAsync(async () => {
    await init();
  }, [init]);

  const disconnect = useAsyncCallback(async () => {
    try {
      await connector.killSession();
      console.log('killedSession');
    } catch (err) {
      console.error(err);
    }
  });

  const read = useAsyncCallback(async () => {
    setStorageValue(await state?.contract.methods.read().call({from: state?.accounts[0]}));
  });

  const write = useAsyncCallback(async () => {
    if (!inputValue) {
      return Alert.alert('Please enter a value to write.');
    }
    await state?.contract.methods.write(Number(inputValue)).send({from: state?.accounts[0]});
  });

  return (
    <SafeAreaView style={styles.rootView}>
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>Storage: {storageValue}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={read.execute}>
            <Text style={styles.buttonText}>Read</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.writeSection}>
          <TextInput
            style={styles.input}
            onChangeText={onInputValueChange}
            value={inputValue}
            placeholder="write here"
            placeholderTextColor="#DDDDDD"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.writeButton} onPress={write.execute}>
            <Text style={styles.buttonText}>Write</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button title="Disconnect" onPress={disconnect.execute} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  section: {},
  writeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 12,
    borderWidth: 1,
    color: '#000000',
  },
  writeButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  buttonText: {
    color: '#000000',
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },
  countText: {
    color: '#000000',
  },
});

export default Home;
