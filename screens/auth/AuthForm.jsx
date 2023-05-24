import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, LoadingButton } from '../../components/Button';
import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    marginLeft: '5%',
    marginTop: '15%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    marginVertical: '3%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkbox: {
    marginRight: 6,
  },
  input: {
    fontSize: 20,
    backgroundColor: '#FFFFFF',
    paddingLeft: 5,
    height: '12%',
    marginVertical: '1%',
    marginHorizontal: '5%',
    width: '90%',
  },
  authPropContainer: {
    marginTop: '4%',
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-around',
  },
  forgotButton: {
    color: '#427ADE',
    fontSize: 14,
  },
});

const Form = ({ onSubmit, isLoading, errorMessage, setShowRecovery, saveCreds, setSaveCreds }) => {
  const globalStyles = useGlobalStyles();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={[styles.container, globalStyles.border]}>
      <Image style={styles.logoImage} source={require('../../assets/logo_red.png')} />

      <Text>{errorMessage}</Text>

      <TextInput
        style={[styles.input, globalStyles.border]}
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
        style={[styles.input, globalStyles.border]}
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

      <View style={styles.authPropContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox style={styles.checkbox} value={saveCreds} onValueChange={setSaveCreds} />
          <Text>Запомнить пароль?</Text>
        </View>

        <ClickableText
          textStyle={styles.forgotButton}
          text="Забыли пароль?"
          onPress={() => setShowRecovery(true)}
        />
      </View>

      {isLoading ? (
        <LoadingButton />
      ) : (
        <Button text="Войти" onPress={() => onSubmit(login, password)} />
      )}
    </View>
  );
};

export default Form;
