import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
    marginVertical: '2%',
  },
  headerText: {
    fontSize: 26,
    color: '#C62E3E',
    fontWeight: '700',
    marginLeft: '5%',
  },
});

const Header = ({ text, onBackButtonClick }) => (
  <View style={styles.headerContainer}>
    {onBackButtonClick ? (
      <TouchableOpacity onPress={onBackButtonClick}>
        <AntDesign name={'left'} size={24} color={'#C62E3E'} />
      </TouchableOpacity>
    ) : (
      ''
    )}
    <Text style={styles.headerText}>{text}</Text>
  </View>
);

export default Header;
