import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import Card from './Card';

const styles = StyleSheet.create({
  cardHeaderView: {
    marginBottom: '2%',
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const CardHeaderOut = ({ topText, children }) => {
  const globalStyles = useGlobalStyles();

  return (
    <>
      <View style={styles.cardHeaderView}>
        <Text style={[styles.cardHeaderText, globalStyles.textColor]}>{topText}</Text>
      </View>
      <Card>{children}</Card>
    </>
  );
};

export default CardHeaderOut;
