import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PRIVACY_POLICY_URL } from '../../utils';

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
  },
  privacyPolicyText: {
    fontWeight: 'bold',
    color: '#C62E3E',
  },
});

const AuthFooter = () => (
  <View style={styles.view}>
    <Text style={styles.infoText}>
      Приложение ЕТИС мобайл является неоффициальным мобильным приложением для ЕТИС ПГНИУ
    </Text>
    <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
      <Text style={styles.privacyPolicyText}>Политика конфиденциальности</Text>
    </TouchableOpacity>
  </View>
);

export default AuthFooter;
