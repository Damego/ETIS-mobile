import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { GLOBAL_STYLES } from '../../styles/styles';
import { BackButton, LoadingButton, RequestButton } from './RequestButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    marginLeft: '5%',
    borderRadius: 10,
    marginTop: '15%',

    flexDirection: 'column',
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    marginVertical: '3%',
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#F8F8FE',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingLeft: 5,
    minHeight: '7%',
    marginVertical: '1%',
    marginHorizontal: '5%',
    width: '90%',
  },
});

const Message = ({ messageText }) => (
  <View>
    <Text>{messageText}</Text>
  </View>
);

const SendEmailForm = ({ onSubmit, isLoading, message, setShowModal, disabledRequestButton }) => {
  const [login, setLogin] = useState('');

  return (
    <View style={[styles.container, GLOBAL_STYLES.shadow]}>
      <Image style={styles.logoImage} source={require('../../assets/logo_red.png')} />

      <Message messageText={message} />

      <TextInput
        style={[styles.input, GLOBAL_STYLES.shadow]}
        onChangeText={(newLogin) => {
          setLogin(newLogin);
        }}
        placeholder="Эл. почта"
        autoComplete="email"
        inputMode="email"
        keyboardType="email-address"
        selectionColor="#C62E3E"
        autoCapitalize="none"
        onSubmitEditing={() => onSubmit(login)}
      />

      {isLoading ? (
        <LoadingButton />
      ) : (
        <RequestButton onPress={() => onSubmit(login)} disabled={disabledRequestButton} />
      )}
      <BackButton onPress={() => setShowModal(false)} />
    </View>
  );
};

export default SendEmailForm;