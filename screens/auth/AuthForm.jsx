import { Checkbox } from 'expo-checkbox';
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
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkBox: {
    marginRight: 6,
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
  authPropContainer: {
    marginTop: '4%',
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: '3%',
    width: '95%',
  },
  forgot: {
    color: '#427ade',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    fontSize: 14,
  },
});

const ErrorMessage = ({ messageText }) => (
  <View>
    <Text>{messageText}</Text>
  </View>
);

const Form = ({ onSubmit, isLoading, errorMessage, setShowRecovery, saveCreds, setSaveCreds }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={[styles.container, GLOBAL_STYLES.shadow]}>
      <Image style={styles.logoImage} source={require("../../assets/logo_red.png")} />

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

      <View style={styles.authPropContainer}>
        <View style={styles.section}>
          <Checkbox style={styles.checkBox} value={saveCreds} onValueChange={setSaveCreds} />
          <Text>Запомнить пароль?</Text>
        </View>
        <Text style={styles.forgot} onPress={() => setShowRecovery(true)}>Забыли пароль?</Text>
      </View>

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