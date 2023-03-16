import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  view: {
    marginTop: '5%',
    backgroundColor: '#ce2539',
    width: '40%',
    height: '12%',
    marginLeft: '40%',
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: "500",
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
