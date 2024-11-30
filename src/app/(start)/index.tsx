import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '~/components/Button';
import SafeAreaScreen from '~/components/SafeAreaScreen';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import AuthFooter from '~/screens/etis/auth/AuthFooter';
import { fontSize } from '~/utils/texts';

type UserType = 'teacher' | 'student';

const StartScreen = () => {
  const router = useRouter();
  const globalStyles = useGlobalStyles();
  const [selectedType, setSelectedType] = useState<UserType>(null);

  const handleChoose = () => {
    if (selectedType === 'student') {
      router.push('(start)/student');
    } else {
      router.push('(start)/teacher');
    }
  };

  const handlePress = (type: UserType) => () => {
    setSelectedType(type);
  };

  const renderButton = (text: string, type: UserType) => (
    <TouchableOpacity
      onPress={handlePress(type)}
      style={[
        styles.buttonView,
        selectedType === type
          ? globalStyles.primaryBorder
          : [globalStyles.card, globalStyles.invisibleBorder],
      ]}
    >
      <View style={{ width: 35, alignItems: 'center' }}>
        <FontAwesome5
          name={type === 'teacher' ? 'chalkboard-teacher' : 'male'}
          size={24}
          color={globalStyles.textColor.color}
        />
      </View>

      <Text style={styles.buttonText}>{text}</Text>

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
