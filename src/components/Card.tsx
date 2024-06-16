import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '~/hooks/theme';

import { useGlobalStyles } from '../hooks';

const Card = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  const globalStyles = useGlobalStyles();

  return <View style={[styles.cardView, globalStyles.container, style]}>{children}</View>;
};

export default Card;

const styles = StyleSheet.create({
  cardView: {
    padding: '4%',
  },
});
