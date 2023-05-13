import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GLOBAL_STYLES } from '../../styles/styles';

const styles = StyleSheet.create({
  request: {
    height: '12%',
    width: '90%',
    marginTop: '10%',
    paddingHorizontal: '5%',
    backgroundColor: '#ce2539',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    height: '12%',
    width: '90%',
    marginTop: '5%',
    marginBottom: '2.8%',
    paddingHorizontal: '5%',
    backgroundColor: '#4faee0',
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

const RequestButton = ({ onPress, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    style={[styles.request, GLOBAL_STYLES.shadow]}
    disabled={disabled}
  >
    <Text style={styles.text}>Получить письмо</Text>
  </TouchableOpacity>
);

const BackButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    style={[styles.back, GLOBAL_STYLES.shadow]}
  >
    <Text style={styles.text}>Назад</Text>
  </TouchableOpacity>
);

const LoadingButton = () => (
  <View style={[styles.request, GLOBAL_STYLES.shadow]}>
    <ActivityIndicator size="large" color="#FFFFFF" />
  </View>
);

export { RequestButton, LoadingButton, BackButton };