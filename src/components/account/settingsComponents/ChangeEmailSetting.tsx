import React from 'react';
import BaseSettingButton from '~/components/baseSettingButton';
import useAppRouter from '~/hooks/useAppRouter';

const ChangeEmailSetting = () => {
  const router = useAppRouter();

  const handlePress = () => {
    router.push('changeEmail');
  };

  return <BaseSettingButton iconName={'mail'} label={'Изменить почту'} onPress={handlePress} />;
};

export default ChangeEmailSetting;
