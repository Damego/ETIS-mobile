import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { GLOBAL_STYLES } from '../../styles/styles';
import { AuthButton, LoadingButton } from './AuthButton';

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

const ErrorMessage = ({ messageText }) => (
  <View>
    <Text>{messageText}</Text>
  </View>
);

const Form = ({ onSubmit, isLoading, errorMessage }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={[styles.container, GLOBAL_STYLES.shadow]}>
      <Image style={styles.logoImage} source={require('../../assets/logo_red.png')} />

      <ErrorMessage messageText={errorMessage} />

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
      />
      <TextInput
        style={[styles.input, GLOBAL_STYLES.shadow]}
        onChangeText={(newPassword) => {
          setPassword(newPassword);
        }}
        placeholder="Пароль"
        secureTextEntry
        autoComplete="password"
        selectionColor="#C62E3E"
        autoCompleteType="password"
        onSubmitEditing={() => onSubmit(login, password)}
      />

      {isLoading ? (
        <LoadingButton />
      ) : (
        <AuthButton
          onPress={() => onSubmit(login, password)}
        />
      )}
    </View>
  );
};

export default Form;