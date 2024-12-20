import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Switch, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { cache } from '~/cache/smartCache';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '~/hooks';
import { setSignNotification } from '~/redux/reducers/settingsSlice';
import { registerSignsFetchTask, unregisterBackgroundFetchAsync } from '~/tasks/signs/signs';
import { NOTIFICATION_GUIDE_URL } from '~/utils';
import { fontSize } from '~/utils/texts';

const styles = StyleSheet.create({
  cardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: { ...fontSize.medium },
  textWithIcon: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});

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
    <View style={styles.cardView}>
      <View style={styles.textWithIcon}>
        <AntDesign name={'notification'} size={26} color={globalStyles.textColor.color} />
        <Text style={styles.header}>Уведомлять об оценках</Text>
      </View>

      <TouchableOpacity onPress={() => Linking.openURL(NOTIFICATION_GUIDE_URL)}>
        <AntDesign // TODO: make as modal w/ blur
          name="infocirlceo"
          size={24}
          color={globalStyles.textColor.color}
        />
      </TouchableOpacity>
      <Switch
        trackColor={{ false: 'gray', true: globalStyles.primaryText.color }}
        thumbColor="white"
        onValueChange={(value) => changeSignNotification(value)}
        value={signNotification}
      />
    </View>
  );
};

export default ToggleSignNotification;
