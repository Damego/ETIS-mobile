import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#f8f8fa',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
});

const LoadingPage = () => (
  <View style={styles.view}>
    <Image style={styles.image} source={require('../assets/logo_red.png')} />
  </View>
);

export default LoadingPage;
