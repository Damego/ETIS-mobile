import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  view: {
    marginTop: '5%',
    backgroundColor: '#C62E3E',
    width: '50%',
    height: '20%',
    marginLeft: '25%',
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 25,
    paddingTop: 5,
  },
});

const AuthButton = ({ onPress }) => (
  <View style={styles.view}>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}>Войти</Text>
    </TouchableOpacity>
  </View>
);

export default AuthButton;
