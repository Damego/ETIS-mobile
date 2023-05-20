import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ReviewBox from '../../components/ReviewBox';
import Screen from '../../components/Screen';
import AuthContext from '../../context/AuthContext';
import { parseMenu } from '../../parser';
import { userData } from '../../parser/menu';
import { GLOBAL_STYLES } from '../../styles/styles';
import { httpClient, storage } from '../../utils';
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
  // TODO: replace with redux state
  const [userDataLoaded, setUserDataLoaded] = useState(userData.data?.student !== undefined);
  const [showReviewModal, setShowReviewModal] = useState(false)

  useEffect(() => {
    storage.bumpReviewRequest().then(res => setShowReviewModal(res));
    const wrapper = async () => {
      if (!userDataLoaded) {
        const html = await httpClient.getGroupJournal();
        if (!html) return;
        parseMenu(html, true);
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
        <UserInfo data={userData.data.student} />
      </View>

      <View style={{ flex: 10 }}>
        <Text style={GLOBAL_STYLES.textTitle}>Меню</Text>
        <Menu />
      </View>

      {showReviewModal ?
        <View style={{ paddingBottom: 150}}>
          <ReviewBox
            setReviewed={() => {
              setShowReviewModal(false);
              storage.setReviewSubmitted();
            }}
            setViewed={() => setShowReviewModal(false)}
          />
        </View> :
        null}

      <TouchableOpacity onPress={signOut}>
        <View style={styles.exitView}>
          <Text style={styles.exitText}>Выйти из аккаунта</Text>
        </View>
      </TouchableOpacity>
    </Screen>
  );
};

export default Services;
