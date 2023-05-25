import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useGlobalStyles } from '../hooks';

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#ffffff',
    padding: '2%',
    marginBottom: '2%',
    borderWidth: 1,
  },
});

const Card = ({ children }) => {
  const globalStyles = useGlobalStyles();

  return <View style={[styles.cardView, globalStyles.border, globalStyles.block]}>{children}</View>;
};

export default Card;
