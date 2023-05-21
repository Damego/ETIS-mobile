import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Card from './Card';

const styles = StyleSheet.create({
  cardHeaderView: {
    marginBottom: '4%',
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const CardHeaderIn = ({ topText, children }) => (
  <Card>
    <View style={styles.cardHeaderView}>
      <Text style={styles.cardHeaderText}>{topText}</Text>
    </View>
    {children}
  </Card>
);

export default CardHeaderIn;
