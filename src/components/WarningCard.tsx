import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';
import Card from './Card';

const styles = StyleSheet.create({
  cardView: {
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

const WarningCard = ({ text }: { text: string }) => {
  const globalStyles = useGlobalStyles();

  return (
    <Card style={[globalStyles.primaryBackgroundColor, styles.cardView]}>
      <Text style={[fontSize.medium, styles.text]}>{text}</Text>
    </Card>
  );
};

export default WarningCard;
