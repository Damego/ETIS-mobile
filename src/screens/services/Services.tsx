import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ClickableText from '../../components/ClickableText';
import ReviewBox from '../../components/ReviewBox';
import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { signOut } from '../../redux/reducers/authSlice';
import { storage } from '../../utils';
import { fontSize } from '../../utils/texts';
import Menu from './Menu';
import UserInfo from './UserInfo';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  exitView: { position: 'absolute', bottom: '2%', left: 0, right: 0, alignItems: 'center' },
  exitText: {
    ...fontSize.medium,
    fontWeight: 'bold',
  },
  textTitle: {
    ...fontSize.large,
    fontWeight: '600',
    marginBottom: '2%',
  },
});

const SettingButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => {navigation.navigate("Настройки")}} style={{justifyContent: 'center'}}>
      <AntDesign name="setting" size={28} color={'#C62E3E'} />
    </TouchableOpacity>
  )
}

const Services = () => {
  const globalStyles = useGlobalStyles();

  const dispatch = useAppDispatch();
  const studentInfo = useAppSelector((state) => state.student.info);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    storage.bumpReviewRequest().then((res) => setShowReviewModal(res));
  }, []);

  const doSignOut = async () => {
    await storage.deleteAccountData();
    dispatch(signOut({ cleanUserCredentials: true }));
  };

  return (
    <Screen headerTitleComponent={<SettingButton />}>
      <View>
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
