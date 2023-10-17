import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { PRIVACY_POLICY_URL, TELEGRAM_URL } from '../../utils';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    paddingBottom: '4%',
  },
  infoText: {
    textAlign: 'center',
  },
  privacyPolicyText: {
    ...fontSize.small,
    fontWeight: 'bold',
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
        Приложение ЕТИС мобайл является неофициальным мобильным приложением для ЕТИС ПГНИУ
      </Text>
      <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
        <Text style={[styles.privacyPolicyText, globalStyles.primaryFontColor]}>
          Политика конфиденциальности
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL(TELEGRAM_URL)}>
        <Text style={styles.telegramText}>Telegram канал</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
