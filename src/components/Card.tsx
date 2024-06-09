import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { useAppTheme } from '~/hooks/theme';

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#fff',
    padding: '2%',
    marginBottom: '2%',
  },
});

const Card = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View
      style={[
        styles.cardView,
        globalStyles.borderRadius,
        globalStyles.block,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
