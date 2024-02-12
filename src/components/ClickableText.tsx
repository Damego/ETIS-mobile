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
  icon?: React.ReactNode;
}

const ClickableText = ({
  text,
  textStyle,
  viewStyle,
  onPress,
  adjustsFontSizeToFit,
  colorVariant,
  icon,
}: ClickableTextProps) => (
  <TouchableOpacity style={[styles.row, viewStyle]} onPress={onPress}>
    <Text adjustsFontSizeToFit={adjustsFontSizeToFit} style={textStyle} colorVariant={colorVariant}>
      {text}
    </Text>
    {icon}
  </TouchableOpacity>
);

export default ClickableText;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
