import { useNavigation } from '@react-navigation/native';
import React from 'react';
import BaseSettingButton from '~/components/baseSettingButton';
import { EducationNavigationProp } from '~/navigation/types';

const ChangePasswordSetting = () => {
  const navigation = useNavigation<EducationNavigationProp>();

  const handlePress = () => {
    navigation.navigate('ChangePassword');
  };

  return <BaseSettingButton iconName={'lock'} label={'Изменить пароль'} onPress={handlePress} />;
};

export default ChangePasswordSetting;
