import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
  },
  text: {
    flexGrow: 1,
    fontSize: 10,
    textAlign: 'center',
  },
});

const AuthFooter = () => (
  <View style={styles.view}>
    <Text style={styles.text}>
      Приложение ЕТИС мобайл является неоффициальным мобильным приложением для ЕТИС
    </Text>
  </View>
);

export default AuthFooter;
