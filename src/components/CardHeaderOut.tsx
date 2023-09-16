import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';
import Card from './Card';

const styles = StyleSheet.create({
  cardHeaderView: {
    marginBottom: '2%',
  },
  cardHeaderText: {
    fontWeight: '600',
  },
});

const CardHeaderOut = ({ topText, children, style }
  : { topText: string, children: React.ReactNode, style?: StyleProp<ViewStyle> }) => {
  const globalStyles = useGlobalStyles();

  return (
    <>
      <View style={styles.cardHeaderView}>
        <Text style={[fontSize.medium, styles.cardHeaderText, globalStyles.textColor]}>
          {topText}
        </Text>
      </View>
      <Card style={style}>
        {children}
      </Card>
    </>
  );
};

export default CardHeaderOut;
