import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'expo-image';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { useAppSelector } from '~/hooks';
import { StudentData } from '~/models/student';
import { ETISNavigationProp } from '~/navigation/types';

import Shortcuts from './Shortcuts';

const getStudentPartialName = (student: StudentData) => {
  // Возможно такое, что иностранным студентам не стоит каким-либо образом менять последовательность имени, но что поделаешь ¯\_(ツ)_/¯
  const names = student.name.split(' ');
  if (names.length === 3) {
    const [, firstName, fatherName] = names;
    return `${firstName} ${fatherName}`;
  }
  return student.name;
};

const Header = () => {
  const student = useAppSelector((state) => state.student.info);
  const navigation = useNavigation<ETISNavigationProp>();

  const onUserPress = () => {
    navigation.navigate('AccountSettings');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerBackground}>
        <ImageBackground
          source={require('../../../../../assets/background.svg')}
          style={styles.image}
        >
          <TouchableOpacity style={styles.userContainer} onPress={onUserPress}>
            <AntDesign name={'user'} size={20} color={'#FFFFFF'} />
            {student ? (
              <Text style={{ fontSize: 20, color: '#FFFFFF' }}>
                {getStudentPartialName(student)} • {student.groupShort}
              </Text>
            ) : (
              <Text style={{ fontSize: 20, color: '#FFFFFF' }}>Идентификация...</Text>
            )}
            <AntDesign name={'swap'} size={20} color={'#FFFFFF'} />
          </TouchableOpacity>
          <Shortcuts />
        </ImageBackground>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    height: '24%',
  },
  headerBackground: {
    height: '80%',
    backgroundColor: '#c62e3e',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  userContainer: {
    backgroundColor: '#FFFFFF55',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '1%',
    margin: '4%',
    borderRadius: 10,
    gap: 8,
    marginTop: StatusBar.currentHeight,
  },
});
