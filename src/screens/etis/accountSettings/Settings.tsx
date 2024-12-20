import React from 'react';
import { StyleSheet, View } from 'react-native';

import ChangeEmailSetting from './settingsComponents/ChangeEmailSetting';
import ChangePasswordSetting from './settingsComponents/ChangePasswordSetting';
import LogOut from './settingsComponents/LogOut';

const Settings = () => {
  return (
    <View style={styles.card}>
      <ChangeEmailSetting />
      <ChangePasswordSetting />
      <LogOut />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: '2%',
  },
});
