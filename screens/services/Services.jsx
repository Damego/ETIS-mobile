import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ClickableText from '../../components/ClickableText';
import ReviewBox from '../../components/ReviewBox';
import Screen from '../../components/Screen';
import { signOut } from '../../redux/authSlice';
import { GLOBAL_STYLES } from '../../styles/styles';
import { storage } from '../../utils';
import Menu from './Menu';
import UserInfo from './UserInfo';
import { useTheme } from '@react-navigation/native';

const styles = StyleSheet.create({
  exitView: { position: 'absolute', bottom: '2%', left: 0, right: 0, alignItems: 'center' },
  exitText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const Services = () => {
  const {
    colors: { primary },
  } = useTheme();

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

      <ClickableText
        text="Выйти из аккаунта"
        viewStyle={styles.exitView}
        textStyle={[styles.exitText, {color: primary}]}
        onPress={doSignOut}
      />
    </Screen>
  );
};

export default Services;
