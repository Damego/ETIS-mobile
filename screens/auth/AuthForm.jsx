import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import AuthButton from './AuthButton';

const styles = StyleSheet.create({
  view: {
    marginVertical: '50%',
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: '#C62E3E',
    padding: 10,
    marginVertical: 20,
    marginHorizontal: '10%',
    width: '80%',
  },
});

const Form = ({ onSubmit }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.view}>
      <TextInput
        style={styles.input}
        onChangeText={(newLogin) => {
          setLogin(newLogin);
        }}
        placeholder="Логин"
      />
      <TextInput
        style={styles.input}
        onChangeText={(newPassword) => {
          setPassword(newPassword);
        }}
        placeholder="Пароль"
        secureTextEntry
      />

      <AuthButton
        onPress={() => {
          onSubmit(login, password);
        }}
      />
    </View>
  );
};

export default Form;
