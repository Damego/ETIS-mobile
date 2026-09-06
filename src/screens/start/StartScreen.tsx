import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Button } from '~/components/Button';
import SafeAreaScreen from '~/components/SafeAreaScreen';
import Text from '~/components/Text';
import { useGlobalStyles, usePsutechHealth } from '~/hooks';
import { StartStackScreenProps } from '~/navigation/types';
import AuthFooter from '~/screens/etis/auth/AuthFooter';
import { fontSize } from '~/utils/texts';

type UserType = 'teacher' | 'student';

const StartScreen = ({ navigation }: StartStackScreenProps) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const { isDown: psutechDown } = usePsutechHealth();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleChoose = () => {
    if (selectedType === 'student') {
      navigation.navigate('SelectStudentAccountType');
    } else if (psutechDown !== true) {
      navigation.navigate('SelectTeacher');
    }
  };

  const handlePress = (type: UserType) => () => {
    setSelectedType(type);
  };

  const renderButton = (text: string, type: UserType) => {
    const disabled = type === 'teacher' && psutechDown === true;

    return (
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.buttonView,
          selectedType === type
            ? globalStyles.primaryBorder
            : [globalStyles.card, globalStyles.invisibleBorder],
          disabled && styles.buttonDisabled,
        ]}
        accessibilityState={disabled ? { disabled: true } : undefined}
        onPress={handlePress(type)}
      >
        <View style={{ width: 35, alignItems: 'center' }}>
          <Ionicons
            name={type === 'teacher' ? 'people' : 'person'}
            size={24}
            color={disabled ? globalStyles.textColor2.color : globalStyles.textColor.color}
          />
        </View>

        <Text style={[styles.buttonText, disabled && globalStyles.textColor2]}>{text}</Text>

        {selectedType === type && (
          <AntDesign
            name={'checkcircle'}
            color={globalStyles.primaryText.color}
            size={20}
            style={{ marginLeft: 'auto' }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaScreen>
      <Text style={styles.titleText}>{t('start.whoWillUse')}</Text>
      <View style={styles.container}>
        {renderButton(t('start.imStudent'), 'student')}
        {renderButton(t('start.imTeacher'), 'teacher')}
      </View>

      <View style={{ marginTop: 'auto' }}>
        {selectedType !== null && (
          <View style={styles.buttonWrapper}>
            <Button text={t('start.choose')} variant={'primary'} onPress={handleChoose} />
          </View>
        )}

        <AuthFooter />
      </View>
    </SafeAreaScreen>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  titleText: {
    ...fontSize.xlarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '10%',
  },
  container: {
    alignSelf: 'center',
    width: '80%',
    gap: 16,
    marginTop: '20%',
  },
  buttonView: {
    flexDirection: 'row',
    paddingVertical: '8%',
    paddingHorizontal: '4%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...fontSize.big,
    fontWeight: 'bold',
    marginHorizontal: '4%',
  },
  buttonWrapper: {
    marginTop: 'auto',
    marginBottom: '2%',
    width: '90%',
    alignSelf: 'center',
  },
});
