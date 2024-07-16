import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { fontSize } from '~/utils/texts';

import Card from './Card';
import Text from './Text';

const styles = StyleSheet.create({
  cardHeaderView: {
    marginBottom: '4%',
  },
  cardHeaderText: {
    fontWeight: '600',
    ...fontSize.medium,
  },
});

const CardHeaderIn = ({
  topText,
  children,
  style,
}: {
  topText: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <Card style={style}>
      <View style={styles.cardHeaderView}>
        <Text style={styles.cardHeaderText}>{topText}</Text>
      </View>
      {children}
    </Card>
  );
};

export default CardHeaderIn;
