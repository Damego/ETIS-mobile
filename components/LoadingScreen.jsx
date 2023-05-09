import React from 'react';
import { StyleSheet, View } from 'react-native';

import Screen from './Screen';

const styles = StyleSheet.create({
  textView: {
    backgroundColor: '#d3d3d3',
    marginBottom: '3%',
    height: '15%',
    width: '50%',
    borderRadius: 10,
  },
  cardView: {
    flex: 1,
    backgroundColor: '#d3d3d3',
    marginBottom: '3%',
    borderRadius: 10,
  },
});

const EmptyCard = () => (
  <View style={{ flex: 1 }}>
    <View style={styles.textView} />
    <View style={styles.cardView} />
  </View>
);

const LoadingScreen = ({ headerText }) => (
  <Screen headerText={headerText} disableRefresh>
    <View style={{ marginTop: '10%' }} />
    <EmptyCard />
    <EmptyCard />
    <EmptyCard />
    <EmptyCard />
  </Screen>
);

export default LoadingScreen;
