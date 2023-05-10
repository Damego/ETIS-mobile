import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GLOBAL_STYLES } from '../styles/styles';

const styles = StyleSheet.create({
  cardView: {
    padding: '2%',
    alignItems: 'center',
    flex: 1,
    display: 'flex',
    backgroundColor: '#FFEB3B',
    marginBottom: '3%',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const WarningCard = ({ text }) => (
  <View style={[styles.cardView, GLOBAL_STYLES.shadow]}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

export default WarningCard;
