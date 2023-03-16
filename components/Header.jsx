import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
  <View>
    <StatusBar/>
    <View style={styles.headerContainer}>
      {/* eslint-disable-next-line react/style-prop-object */}

      <Text style={styles.headerText}>{text}</Text>
    </View>
  </View>

);

export default Header;
