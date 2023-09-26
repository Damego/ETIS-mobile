import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import ReviewBox from '../../components/ReviewBox';
import Screen from '../../components/Screen';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';
import Menu from './Menu';
import UserInfo from './UserInfo';
import { ServicesNavigationProp } from '../../navigation/types';

const styles = StyleSheet.create({
  textTitle: {
    ...fontSize.large,
    fontWeight: '600',
    marginBottom: '2%',
  },
});

export const SettingButton = () => {
  const navigation = useNavigation<ServicesNavigationProp>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Settings');
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
    cache.bumpReviewRequest().then((res) => setShowReviewModal(res));
  }, []);

  return (
    <Screen>
      <View>
        <UserInfo data={studentInfo} />

        <Text style={[styles.textTitle, globalStyles.textColor]}>Меню</Text>
        <Menu />

        {showReviewModal && (
          <ReviewBox
            setReviewed={() => {
              setShowReviewModal(false);
              cache.setReviewStep('stop');
            }}
            setViewed={() => setShowReviewModal(false)}
          />
        )}
      </View>
    </Screen>
  );
};

export default Services;
