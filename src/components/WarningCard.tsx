import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

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
    fontWeight: 'bold',
  },
});

const WarningCard = ({ text }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.cardView, globalStyles.shadow]}>
      <Text style={[fontSize.medium, styles.text]}>{text}</Text>
    </View>
  );
};

export default WarningCard;
