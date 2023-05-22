import React from 'react';
import { StyleSheet, View } from 'react-native';

import useGlobalStyles from '../styles';

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: '2%',
    marginBottom: '2%',
  },
});

const Card = ({ children }) => {
  const globalStyles = useGlobalStyles();
  return <View style={[styles.cardView, globalStyles.shadow]}>{children}</View>;
};

export default Card;
