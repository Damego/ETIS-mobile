import React from 'react';
import {
  StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle
} from 'react-native';

import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

import Card from './Card';

const styles = StyleSheet.create({
  cardHeaderView: {
    marginBottom: '2%',
  },
  cardHeaderText: {
    fontWeight: '600',
    ...fontSize.medium,
  },
});

const CardHeaderOut = ({
  topText,
  children,
  style,
  topTextStyle,
}: {
  readonly topText?: string;
  readonly children: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly topTextStyle?: StyleProp<TextStyle>;
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <View>
      {topText ? <View style={styles.cardHeaderView}>
        <Text style={[styles.cardHeaderText, globalStyles.textColor, topTextStyle]}>
          {topText}
        </Text>
      </View> : null}
      <Card style={style}>{children}</Card>
    </View>
  );
};

export default CardHeaderOut;
