import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '~/components/Text';
import { PRIVACY_POLICY_URL, TELEGRAM_URL } from '~/utils';
import { fontSize } from '~/utils/texts';

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
  return (
    <View style={styles.view}>
      <Text style={styles.infoText}>
        Приложение ЕТИС мобайл является неофициальным мобильным приложением для ЕТИС ПГНИУ
      </Text>
      <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
        <Text style={styles.privacyPolicyText} colorVariant={'primary'}>
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
