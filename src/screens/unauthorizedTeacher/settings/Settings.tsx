import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { cache } from '~/cache/smartCache';
import BaseSettingButton from '~/components/baseSettingButton';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { clearAccountState } from '~/redux/reducers/accountSlice';
import { fontSize } from '~/utils/texts';

const Settings = () => {
  const { t } = useTranslation();
  const teacher = useAppSelector((state) => state.account.teacher);
  const dispatch = useAppDispatch();

  if (!teacher) return null;

  const handleLogOut = () => {
    dispatch(clearAccountState());
    cache.clearAccountData();
  };

  return (
    <Screen>
      <View style={{ alignItems: 'center' }}>
        <Text style={[fontSize.large, { fontWeight: 'bold' }]}>{teacher.name}</Text>
        <Text>{t('settings.teacherRole')}</Text>
      </View>
      <Text style={[fontSize.big, { fontWeight: 'bold', marginVertical: '4%' }]}>
        {t('settings.accountActions')}
      </Text>
      <BaseSettingButton
        iconName={'logout'}
        label={t('settings.logOut')}
        onPress={handleLogOut}
        color={'primary'}
      />
    </Screen>
  );
};

export default Settings;
