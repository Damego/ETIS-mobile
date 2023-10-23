import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import {
  Linking,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

import { cache } from '../../cache/smartCache';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { setSignNotification } from '../../redux/reducers/settingsSlice';
import { registerFetch, unregisterBackgroundFetchAsync } from '../../tasks/signs';
import { NOTIFICATION_GUIDE_URL } from '../../utils';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  cardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: { fontWeight: '500' },
});

const ToggleSignNotification = () => {
  const dispatch = useAppDispatch();
  const signNotification = useAppSelector((state) => state.settings.signNotification);
  const globalStyles = useGlobalStyles();
  const { isDemo, isOfflineMode } = useAppSelector((state) => state.auth);

  const changeSignNotification = (hasSignNotification: boolean) => {
    if (isDemo || isOfflineMode) {
      ToastAndroid.show('Невозможно изменить в демо или оффлайн режимах', ToastAndroid.LONG);
      return;
    }

    if (hasSignNotification) {
      registerFetch();
    } else {
      unregisterBackgroundFetchAsync();
    }
    dispatch(setSignNotification(hasSignNotification));
    cache.placeSignNotification(hasSignNotification);
  };

  return (
    <View style={styles.cardView}>
      <Text style={[styles.header, fontSize.medium, globalStyles.textColor]}>
        Уведомлять об оценках
      </Text>
      <TouchableOpacity onPress={() => Linking.openURL(NOTIFICATION_GUIDE_URL)}>
        <AntDesign // TODO: make as modal w/ blur
          name="infocirlceo"
          size={24}
          color={globalStyles.textColor.color}
        />
      </TouchableOpacity>
      <Switch
        trackColor={{ false: 'gray', true: 'teal' }}
        thumbColor="white"
        onValueChange={(value) => changeSignNotification(value)}
        value={signNotification}
      />
    </View>
  );
};

export default ToggleSignNotification;
