import React from 'react';
import { View } from 'react-native';
import { cache } from '~/cache/smartCache';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import BaseSettingButton from '~/components/baseSettingButton';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { clearAccountState } from '~/redux/reducers/accountSlice';
import ChangeAppUI from '~/screens/settings/components/ChangeAppUI';
import { fontSize } from '~/utils/texts';

const LogOut = ({ onPress }: { onPress: () => void }) => {
  return (
    <BaseSettingButton iconName={'logout'} label={'Выйти'} onPress={onPress} color={'primary'} />
  );
};

const Settings = () => {
  const student = useAppSelector((state) => state.account.student);
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(clearAccountState());
    cache.clearAccountData();
  };

  return (
    <Screen>
      <View style={{ alignItems: 'center' }}>
        <Text style={[fontSize.large, { fontWeight: 'bold' }]}>{student.group.name.full}</Text>
        <Text>Студент</Text>
      </View>
      <Text style={[fontSize.big, { fontWeight: 'bold', marginVertical: '4%' }]}>
        Действия с аккаунтом
      </Text>
      <LogOut onPress={handleLogOut} />
    </Screen>
  );
};

export default Settings;
