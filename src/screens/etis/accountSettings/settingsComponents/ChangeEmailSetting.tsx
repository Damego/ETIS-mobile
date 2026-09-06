import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import BaseSettingButton from '~/components/baseSettingButton';
import { EducationNavigationProp } from '~/navigation/types';

const ChangeEmailSetting = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<EducationNavigationProp>();

  const handlePress = () => {
    navigation.navigate('ChangeEmail', { sendVerificationMail: false });
  };

  return (
    <BaseSettingButton
      iconName={'mail'}
      label={t('account.changeEmailButton')}
      onPress={handlePress}
    />
  );
};

export default ChangeEmailSetting;
