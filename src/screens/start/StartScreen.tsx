import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
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
        onPress={handlePress(type)}
        disabled={disabled}
        style={[
          styles.buttonView,
          selectedType === type
            ? globalStyles.primaryBorder
            : [globalStyles.card, globalStyles.invisibleBorder],
          disabled && styles.buttonDisabled,
        ]}
        accessibilityState={disabled ? { disabled: true } : undefined}
      >
        <View style={{ width: 35, alignItems: 'center' }}>
          <FontAwesome5
            name={type === 'teacher' ? 'chalkboard-teacher' : 'male'}
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
      <Text style={styles.titleText}>Кто будет пользоваться приложением?</Text>
      <View style={styles.container}>
        {renderButton('Я студент/ученик', 'student')}
        {renderButton('Я преподаватель', 'teacher')}
      </View>

      <View style={{ marginTop: 'auto' }}>
        {selectedType !== null && (
          <View style={styles.buttonWrapper}>
            <Button text={'Выбрать'} onPress={handleChoose} variant={'primary'} />
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
