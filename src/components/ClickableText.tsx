import React from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import Text, { TextColorVariant } from './Text';

interface ClickableTextProps {
  text: string | number;
  textStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  onPress(): void;
  adjustsFontSizeToFit?: boolean;
  colorVariant?: TextColorVariant;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const ClickableText = React.forwardRef<TouchableOpacity, ClickableTextProps>(
  (
    {
      text,
      textStyle,
      viewStyle,
      onPress,
      adjustsFontSizeToFit,
      colorVariant,
      iconLeft,
      iconRight,
    },
    ref
  ) => (
    <TouchableOpacity style={[styles.row, viewStyle]} onPress={onPress} ref={ref}>
      {iconLeft}
      <Text
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        style={textStyle}
        colorVariant={colorVariant}
      >
        {text}
      </Text>
      {iconRight}
    </TouchableOpacity>
  )
);

export default ClickableText;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
