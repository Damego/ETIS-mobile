import React from 'react';
import { View, StyleSheet } from 'react-native';

import { GLOBAL_STYLES } from '../styles/styles';

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#ffffff',
    marginBottom: '3%',
    borderRadius: 10,
  },
});

const Card = ({ children }) => (
    <View style={[styles.cardView, GLOBAL_STYLES.shadow]}>{children}</View>
);

export default Card;
