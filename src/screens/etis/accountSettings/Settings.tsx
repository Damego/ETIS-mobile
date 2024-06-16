import React from 'react';
import { StyleSheet } from 'react-native';
import Card from '~/components/Card';
import Text from '~/components/Text';

import ChangeEmailSetting from './settingsComponents/ChangeEmailSetting';
import ChangePasswordSetting from './settingsComponents/ChangePasswordSetting';
import LogOut from './settingsComponents/LogOut';

const Settings = () => {
  return (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>Аккаунт</Text>

      <ChangeEmailSetting />
      <ChangePasswordSetting />
      <LogOut />
    </Card>
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
