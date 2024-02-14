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

const ClickableText = ({
  text,
  textStyle,
  viewStyle,
  onPress,
  adjustsFontSizeToFit,
  colorVariant,
  iconLeft,
  iconRight,
}: ClickableTextProps) => (
  <TouchableOpacity style={[styles.row, viewStyle]} onPress={onPress}>
    {iconLeft}
    <Text adjustsFontSizeToFit={adjustsFontSizeToFit} style={textStyle} colorVariant={colorVariant}>
      {text}
    </Text>
    {iconRight}
  </TouchableOpacity>
);

export default ClickableText;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
