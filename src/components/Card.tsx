import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { useAppTheme } from '~/hooks/theme';

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#fff',
    padding: '2%',
    marginBottom: '2%',
    borderWidth: 1,
  },
});

const Card = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.cardView,
        globalStyles.border,
        globalStyles.block,
        theme.disabledCardBorder ? { borderWidth: 0 } : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
