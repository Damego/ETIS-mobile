import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Screen from '../../components/Screen';
import AuthContext from '../../context/AuthContext';
import { GLOBAL_STYLES } from '../../styles/styles';
import { httpClient, parser, storage } from '../../utils';
import Menu from './Menu';
import UserInfo from './UserInfo';

const styles = StyleSheet.create({
  exitView: { position: 'absolute', bottom: 5, left: 0, right: 0, alignItems: 'center' },
  exitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CE2539',
  },
});

const Services = () => {
  const { toggleSignIn } = useContext(AuthContext);
  const [userDataLoaded, setUserDataLoaded] = useState(parser.hasUserData);

  useEffect(() => {
    const wrapper = async () => {
      if (!userDataLoaded) {
        const html = await httpClient.getGroupJournal();
        if (!html) return;
        parser.parseMenu(html, true);
        setUserDataLoaded(true);
      }
    };
    wrapper();
  }, []);

  const signOut = async () => {
    await storage.deleteAccountData();
    toggleSignIn();
  };

  return (
    <Screen headerText="Сервисы" disableRefresh>
      <View style={{ flex: 1 }}>
        <Text style={GLOBAL_STYLES.textTitle}>Студент</Text>
        <UserInfo data={parser.userData} />
      </View>

      <View style={{ flex: 10 }}>
        <Text style={GLOBAL_STYLES.textTitle}>Меню</Text>
        <Menu />
      </View>

      <TouchableOpacity onPress={signOut}>
        <View style={styles.exitView}>
          <Text style={styles.exitText}>Выйти из аккаунта</Text>
        </View>
      </TouchableOpacity>
    </Screen>
  );
};

export default Services;
