import Constants from 'expo-constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';

import ClickableText from '~/components/ClickableText';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { PRIVACY_POLICY_URL } from '~/utils';
import { fontSize } from '~/utils/texts';

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    position: 'absolute',
    bottom: '1%',
    left: 0,
    right: 0,
  },
});

const About = () => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  return (
    <Screen>
      <Text style={fontSize.medium}>{t('about.description')}</Text>
      <Text style={fontSize.medium}>{t('about.disclaimer')}</Text>
      <Text style={fontSize.medium}>{t('about.privacy')}</Text>

      <View style={styles.view}>
        <ClickableText
          textStyle={[fontSize.medium, globalStyles.primaryText, { fontWeight: '500' }]}
          text={t('about.privacyPolicy')}
          onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
        />
        <Text style={fontSize.medium}>{t('about.appVersion', { version: Constants.expoConfig?.version ?? '' })}</Text>
      </View>
    </Screen>
  );
};

export default About;
