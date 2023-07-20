import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { useAppColorScheme } from '../../hooks/theme';
import { setSignNotification } from '../../redux/reducers/settingsSlice';
import { unregisterBackgroundFetchAsync } from '../../tasks/signs';
import { NOTIFICATION_GUIDE_URL, storage } from '../../utils';
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
  const changeSignNotification = (signNotification: boolean) => {
    unregisterBackgroundFetchAsync();
    dispatch(setSignNotification(signNotification));
    storage.storeSignNotification(signNotification);
  };

  return (
    <View style={styles.cardView}>
      <Text style={[styles.header, fontSize.medium, globalStyles.textColor ]}>
        Уведомлять об оценках
      </Text>
      <TouchableOpacity onPress={() => Linking.openURL(NOTIFICATION_GUIDE_URL)}>
        <AntDesign // TODO: make as modal w/ blur
          name="infocirlce"
          size={24}
          color={useAppColorScheme() === 'light' ? 'black' : 'white'}
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
