import { AntDesign } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { useAppSelector } from '~/hooks';
import Text from '~/components/Text';
import Shortcuts from './Shortcuts';

const Header = () => {
  const student = useAppSelector((state) => state.student.info);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerBackground}>
        <ImageBackground source={require('../../../../../assets/background.svg')} style={styles.image}>
          <View style={styles.userContainer}>
            <AntDesign name={'user'} size={20} color={'#FFFFFF'} />
            <Text style={{ fontSize: 20, color: '#FFFFFF' }}>
              {student?.name} • {student?.group}
            </Text>
            <AntDesign name={'swap'} size={20} color={'#FFFFFF'} />
          </View>
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
