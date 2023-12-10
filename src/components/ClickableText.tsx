import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import Text, { TextColorVariant } from './Text';

interface ClickableTextProps {
  text: string | number;
  textStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  onPress(): void;
  adjustsFontSizeToFit?: boolean;
  colorVariant?: TextColorVariant;
}

const ClickableText = ({
  text,
  textStyle,
  viewStyle,
  onPress,
  adjustsFontSizeToFit,
  colorVariant,
}: ClickableTextProps) => (
  <TouchableOpacity style={viewStyle} onPress={onPress}>
    <Text adjustsFontSizeToFit={adjustsFontSizeToFit} style={textStyle} colorVariant={colorVariant}>
      {text}
    </Text>
  </TouchableOpacity>
);

export default ClickableText;
