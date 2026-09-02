import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Linking, ToastAndroid, TouchableOpacity } from 'react-native';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '~/hooks';
import { setSignNotification } from '~/redux/reducers/settingsSlice';
import { registerSignsFetchTask, unregisterBackgroundFetchAsync } from '~/tasks/signs/signs';
import { NOTIFICATION_GUIDE_URL } from '~/utils';

const ToggleSignNotification = () => {
  const dispatch = useAppDispatch();
  const signNotification = useAppSelector((state) => state.settings.config.signNotificationEnabled);
  const globalStyles = useGlobalStyles();
  const { isDemo, isOfflineMode } = useAppSelector((state) => state.account);

  const changeSignNotification = (hasSignNotification: boolean) => {
    if (isDemo || isOfflineMode) {
      ToastAndroid.show('Невозможно изменить в демо или оффлайн режимах', ToastAndroid.LONG);
      return;
    }

    if (hasSignNotification) {
      registerSignsFetchTask();
    } else {
      unregisterBackgroundFetchAsync();
    }
    dispatch(setSignNotification(hasSignNotification));
    cache.placeSignNotification(hasSignNotification);
  };

  return (
    <SettingRow
      label='Уведомлять об оценках'
      icon={<AntDesign name={'notification'} size={24} color={globalStyles.textColor.color} />}
      hint={
        <TouchableOpacity onPress={() => Linking.openURL(NOTIFICATION_GUIDE_URL)}>
          <AntDesign // TODO: make as modal w/ blur
            name='infocirlceo'
            size={24}
            color={globalStyles.textColor.color}
          />
        </TouchableOpacity>
      }
      right={<ThemedSwitch onValueChange={changeSignNotification} value={signNotification} />}
    />
  );
};

export default ToggleSignNotification;
