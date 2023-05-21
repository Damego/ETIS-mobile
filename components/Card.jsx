import React from 'react';
import { View, StyleSheet } from 'react-native';

import { GLOBAL_STYLES } from '../styles/styles';

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: '2%',
    marginBottom: '2%'
  },
});

const Card = ({ children }) => (
    <View style={[styles.cardView, GLOBAL_STYLES.shadow]}>{children}</View>
);

export default Card;
