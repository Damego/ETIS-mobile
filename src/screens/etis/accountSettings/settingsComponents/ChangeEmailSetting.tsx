import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { EducationNavigationProp } from '~/navigation/types';

import BaseSettingButton from './base';

const ChangeEmailSetting = () => {
  const navigation = useNavigation<EducationNavigationProp>();

  const handlePress = () => {
    navigation.navigate('ChangeEmail');
  };

  return <BaseSettingButton iconName={'mail'} label={'Изменить почту'} onPress={handlePress} />;
};

export default ChangeEmailSetting;
