import React from 'react';
import BaseSettingButton from '~/components/baseSettingButton';
import useAppRouter from '~/hooks/useAppRouter';

const ChangePasswordSetting = () => {
  const router = useAppRouter();

  const handlePress = () => {
    router.push('changePassword');
  };

  return <BaseSettingButton iconName={'lock'} label={'Изменить пароль'} onPress={handlePress} />;
};

export default ChangePasswordSetting;
