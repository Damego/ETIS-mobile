import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GLOBAL_STYLES } from '../styles/styles';

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    display: 'flex',
    width: '96%',
    backgroundColor: '#ffffff',
    marginLeft: '2%',
    marginBottom: '3%',
    borderRadius: 10,
  },
  cardHeaderView: {
    marginLeft: '2%',
    marginBottom: 4,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const Card = ({ topText, children }) => (
  <View>
    <View style={styles.cardHeaderView}>
      <Text style={styles.cardHeaderText}>{topText}</Text>
    </View>
    <View style={[styles.cardView, GLOBAL_STYLES.shadow]}>{children}</View>
  </View>
);

export default Card;
