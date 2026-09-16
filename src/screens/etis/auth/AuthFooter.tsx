import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking, StyleSheet, TouchableOpacity, View
} from 'react-native';

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
  const { t } = useTranslation();

  return (
    <View style={styles.view}>
      <Text style={styles.infoText}>{t('auth.footerDisclaimer')}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
        <Text style={styles.privacyPolicyText} colorVariant={'primary'}>
          {t('about.privacyPolicy')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL(TELEGRAM_URL)}>
        <Text style={styles.telegramText}>{t('auth.telegramChannel')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
