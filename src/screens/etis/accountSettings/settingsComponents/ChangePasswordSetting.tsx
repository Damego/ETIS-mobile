import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import BaseSettingButton from '~/components/baseSettingButton';
import { EducationNavigationProp } from '~/navigation/types';

const ChangePasswordSetting = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<EducationNavigationProp>();

  const handlePress = () => {
    navigation.navigate('ChangePassword');
  };

  return (
    <BaseSettingButton
      iconName={'lock'}
      label={t('account.changePasswordButton')}
      onPress={handlePress}
    />
  );
};

export default ChangePasswordSetting;
