import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ClickableText from '../../components/ClickableText';
import ReviewBox from '../../components/ReviewBox';
import Screen from '../../components/Screen';
import { useGlobalStyles } from '../../hooks';
import { signOut } from '../../redux/reducers/authSlice';
import { storage } from '../../utils';
import Menu from './Menu';
import UserInfo from './UserInfo';

const styles = StyleSheet.create({
  exitView: { position: 'absolute', bottom: '2%', left: 0, right: 0, alignItems: 'center' },
  exitText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: '2%',
  },
});

const Services = () => {
  const globalStyles = useGlobalStyles();

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
    <Screen disableRefresh>
      <View>
        <Text style={[styles.textTitle, globalStyles.textColor]}>Студент</Text>
        <UserInfo data={studentInfo} />

        <Text style={[styles.textTitle, globalStyles.textColor]}>Меню</Text>
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
        textStyle={[styles.exitText, globalStyles.primaryFontColor]}
        onPress={doSignOut}
      />
    </Screen>
  );
};

export default Services;
