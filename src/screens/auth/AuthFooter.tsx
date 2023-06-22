import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { PRIVACY_POLICY_URL, TELEGRAM_URL } from '../../utils';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    paddingTop: '5%',
  },
  infoText: {
    textAlign: 'center',
  },
  privacyPolicyText: {
    ...fontSize.small,
    fontWeight: 'bold',
    color: '#C62E3E',
  },
  telegramText: {
    fontWeight: 'bold',
    color: '#2e7ac6',
    ...fontSize.medium,
  },
});

const AuthFooter = () => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={styles.view}>
      <Text style={[styles.infoText, globalStyles.textColor]}>
        Приложение ЕТИС мобайл является неоффициальным мобильным приложением для ЕТИС ПГНИУ
      </Text>
      <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
        <Text style={styles.privacyPolicyText}>Политика конфиденциальности</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL(TELEGRAM_URL)}>
        <Text style={styles.telegramText}>Telegram-паблик</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
