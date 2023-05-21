import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ReviewBox from '../../components/ReviewBox';
import Screen from '../../components/Screen';
import { signOut } from '../../redux/authSlice';
import { GLOBAL_STYLES } from '../../styles/styles';
import { storage } from '../../utils';
import Menu from './Menu';
import UserInfo from './UserInfo';

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
  const studentInfo = useSelector((state) => state.student.info);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    storage.bumpReviewRequest().then((res) => setShowReviewModal(res));
  }, []);

  const doSignOut = async () => {
    await storage.deleteAccountData();
    dispatch(signOut({ autoAuth: false }));
  };

  return (
    <Screen headerText="Сервисы" disableRefresh>
      <View>
        <Text style={GLOBAL_STYLES.textTitle}>Студент</Text>
        <UserInfo data={studentInfo} />

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
