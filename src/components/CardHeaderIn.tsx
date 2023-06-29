import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';
import Card from './Card';

const styles = StyleSheet.create({
  cardHeaderView: {
    marginBottom: '4%',
  },
  cardHeaderText: {
    fontWeight: '600',
  },
});

const CardHeaderIn = ({ topText, children }) => {
  const globalStyles = useGlobalStyles();

  return (
    <Card>
      <View style={styles.cardHeaderView}>
        <Text style={[fontSize.medium, styles.cardHeaderText, globalStyles.textColor]}>
          {topText}
        </Text>
      </View>
      {children}
    </Card>
  );
};

export default CardHeaderIn;
