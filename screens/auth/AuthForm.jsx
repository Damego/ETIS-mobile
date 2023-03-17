import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import AuthButton from './AuthButton';
import { GLOBAL_STYLES } from '../../styles/styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    marginLeft: '5%',
    borderRadius: 10,
    marginTop: '15%',
  },
  imageContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    marginVertical: '5%',
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#F8F8FE',
    borderRadius: 10,
    backgroundColor: '#fff',
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
    <View style={[styles.container, GLOBAL_STYLES.shadow]}>
      <View style={styles.imageContainer}>
        <Image style={styles.logoImage} source={require('../../assets/logo_red.png')} />
      </View>

      <TextInput
        style={[styles.input, GLOBAL_STYLES.shadow]}
        onChangeText={(newLogin) => {
          setLogin(newLogin);
        }}
        placeholder="Логин"
      />
      <TextInput
        style={[styles.input, GLOBAL_STYLES.shadow]}
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
