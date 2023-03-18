import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GLOBAL_STYLES } from '../../styles/styles';

const styles = StyleSheet.create({
  view: {
    marginTop: '5%',
    backgroundColor: '#ce2539',
    borderRadius: 10,
    paddingHorizontal: '5%',
    alignItems: 'center',
    marginHorizontal: '5%',
    width: '90%',
    marginBottom: '5%',
    height: '10%',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 25,
  },
  textWrapper: {
    marginTop: '3%',
  },
});

const AuthButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    style={[styles.view, GLOBAL_STYLES.shadow]}
  >
    <View style={styles.textWrapper}>
      <Text style={styles.text}>Войти</Text>
    </View>
  </TouchableOpacity>
);

const LoadingButton = () => (
  <View style={[styles.view, GLOBAL_STYLES.shadow]}>
    <View style={styles.textWrapper}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  </View>
);

export { AuthButton, LoadingButton };
