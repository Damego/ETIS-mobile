import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ReviewBox from '../../components/ReviewBox';
import Screen from '../../components/Screen';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { storage } from '../../utils';
import { fontSize } from '../../utils/texts';
import Menu from './Menu';
import UserInfo from './UserInfo';

const styles = StyleSheet.create({
  textTitle: {
    ...fontSize.large,
    fontWeight: '600',
    marginBottom: '2%',
  },
});

const SettingButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Настройки');
      }}
      style={{ justifyContent: 'center' }}
    >
      <AntDesign name="setting" size={28} color={'#C62E3E'} />
    </TouchableOpacity>
  );
};

const Services = () => {
  const globalStyles = useGlobalStyles();

  const studentInfo = useAppSelector((state) => state.student.info);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    storage.bumpReviewRequest().then((res) => setShowReviewModal(res));
  }, []);

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
    </Screen>
  );
};

export default Services;
