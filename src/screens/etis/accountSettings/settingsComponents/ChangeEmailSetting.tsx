import { useNavigation } from '@react-navigation/native';
import React from 'react';
import BaseSettingButton from '~/components/baseSettingButton';
import { EducationNavigationProp } from '~/navigation/types';

const ChangeEmailSetting = () => {
  const navigation = useNavigation<EducationNavigationProp>();

  const handlePress = () => {
    navigation.navigate('ChangeEmail');
  };

  return <BaseSettingButton iconName={'mail'} label={'Изменить почту'} onPress={handlePress} />;
};

export default ChangeEmailSetting;
