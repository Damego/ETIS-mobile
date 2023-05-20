import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GLOBAL_STYLES } from '../styles/styles';

export const styles = StyleSheet.create({
  container: {
    height: '12%',
    width: '90%',
    marginTop: '5%',
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

const Button = ({ text, onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    style={[styles.container, GLOBAL_STYLES.shadow]}
    disabled={disabled}
  >
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

const LoadingButton = () => (
  <View style={[styles.container, GLOBAL_STYLES.shadow]}>
    <ActivityIndicator size="large" color="#FFFFFF" />
  </View>
);

export { Button, LoadingButton };
