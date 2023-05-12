import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    marginLeft: '5%',
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  headerText: {
    fontSize: 26,
    color: '#C62E3E',
    fontWeight: '700',
  },
});

const Header = ({ text }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>{text}</Text>
  </View>
);

export default Header;
