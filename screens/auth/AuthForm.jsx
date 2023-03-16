import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import AuthButton from './AuthButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    marginLeft: '5%',
    borderRadius: 10,
    marginTop: "15%",

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    marginVertical: "5%"
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#F8F8FE',
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 20,
    marginHorizontal: '10%',
    width: '80%',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
});

const Form = ({ onSubmit }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.logoImage} source={require('../../assets/logo_red.png')} />
      </View>

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
