import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GLOBAL_STYLES } from '../../styles/styles';

const styles = StyleSheet.create({
  view: {
    height: '12%',
    width: '90%',
    marginHorizontal: '5%',
    marginVertical: '5%',
    paddingHorizontal: '5%',
    backgroundColor: '#ce2539',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 25,
  },
});

const AuthButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    style={[styles.view, GLOBAL_STYLES.shadow]}
  >
    <Text style={styles.text}>Войти</Text>
  </TouchableOpacity>
);

const LoadingButton = () => (
  <View style={[styles.view, GLOBAL_STYLES.shadow]}>
    <ActivityIndicator size="large" color="#FFFFFF" />
  </View>
);

export { AuthButton, LoadingButton };
