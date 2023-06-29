import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useGlobalStyles } from '../hooks';

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#ffffff',
    padding: '2%',
    marginBottom: '2%',
    borderWidth: 1,
  },
});

const Card = ({ children, style }: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.cardView, globalStyles.border, globalStyles.block, style]}>
      {children}
    </View>
  );
};

export default Card;
