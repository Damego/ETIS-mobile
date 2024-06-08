import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { cache } from '~/cache/smartCache';
import ReviewBox from '~/components/ReviewBox';
import Screen from '~/components/Screen';
import WarningCard from '~/components/WarningCard';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { ServiceNativeStackScreenProps, ServicesNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';
import Menu from './Menu';
import UserInfo from './UserInfo';

const styles = StyleSheet.create({
  textTitle: {
    ...fontSize.large,
    fontWeight: '600',
    marginBottom: '2%',
  },
});

export const SettingButton = () => {
  const navigation = useNavigation<ServicesNavigationProp>();
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Settings');
      }}
      style={{ justifyContent: 'center' }}
    >
      <AntDesign name="setting" size={28} color={theme.colors.primary} />
    </TouchableOpacity>
  );
};

const Services = ({ navigation }: ServiceNativeStackScreenProps<'Services'>) => {
  const globalStyles = useGlobalStyles();

  const { hasUnverifiedEmail, info } = useAppSelector((state) => state.student);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    cache.bumpReviewRequest().then((res) => setShowReviewModal(res));
  }, []);

  return (
    <Screen>
      {hasUnverifiedEmail && (
        <TouchableOpacity
          onPress={() => navigation.navigate('ChangeEmail', { sendVerificationMail: true })}
        >
          <WarningCard text={'Подтвердите адрес электронной почты!'} />
        </TouchableOpacity>
      )}
      <View>
        <UserInfo data={info} />

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
