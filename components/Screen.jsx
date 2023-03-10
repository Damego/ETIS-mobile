import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import Header from './Header';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8F8FA',
    height: '100%',
  },
});

const Screen = ({ headerText, children }) => (
  <ScrollView showsVerticalScrollIndicator={false} overScrollMode='never'>
    <View style={styles.screen}>
      <Header text={headerText} />
      {children}
    </View>
  </ScrollView>
);

export default Screen;
