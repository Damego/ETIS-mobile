import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import ReviewBox from '../../components/ReviewBox';
import Screen from '../../components/Screen';
import { parseMenu } from '../../parser';
import { userData } from '../../parser/menu';
import { GLOBAL_STYLES } from '../../styles/styles';
import { httpClient, storage } from '../../utils';
import Menu from './Menu';
import UserInfo from './UserInfo';
import { signOut } from '../../redux/authSlice';

const styles = StyleSheet.create({
  exitView: { position: 'absolute', bottom: '2%', left: 0, right: 0, alignItems: 'center' },
  exitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CE2539',
  },
});

const Services = () => {
  const dispatch = useDispatch();
  // TODO: replace with redux state
  const [userDataLoaded, setUserDataLoaded] = useState(userData.data?.student !== undefined);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    storage.bumpReviewRequest().then((res) => setShowReviewModal(res));
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

  const doSignOut = async () => {
    await storage.deleteAccountData();
    dispatch(signOut({ autoAuth: false }));
  };

  return (
    <Screen headerText="Сервисы" disableRefresh>
      <View>
        <Text style={GLOBAL_STYLES.textTitle}>Студент</Text>
        <UserInfo data={userData.data.student} />

        <Text style={GLOBAL_STYLES.textTitle}>Меню</Text>
        <Menu />

        {showReviewModal && (
          <ReviewBox
            setReviewed={() => {
              setShowReviewModal(false);
              storage.setReviewSubmitted();
            }}
            setViewed={() => setShowReviewModal(false)}
          />
        )}
      </View>

      <TouchableOpacity style={styles.exitView} onPress={doSignOut}>
        <Text style={styles.exitText}>Выйти из аккаунта</Text>
      </TouchableOpacity>
    </Screen>
  );
};

export default Services;
