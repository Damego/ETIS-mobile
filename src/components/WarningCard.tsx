import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

const styles = StyleSheet.create({
  cardView: {
    alignItems: 'center',
    marginBottom: '2%',
    padding: '2%',
  },
  text: {
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

const WarningCard = ({ text }: { text: string }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View
      style={[
        styles.cardView,
        globalStyles.shadow,
        globalStyles.border,
        globalStyles.primaryBackgroundColor,
      ]}
    >
      <Text style={[fontSize.medium, styles.text]}>{text}</Text>
    </View>
  );
};

export default WarningCard;
