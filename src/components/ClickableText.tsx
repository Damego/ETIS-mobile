import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ClickableTextProps {
  text: string | number;
  textStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  onPress(): void;
  adjustsFontSizeToFit?: boolean;
}

const ClickableText = ({
  text,
  textStyle,
  viewStyle,
  onPress,
  adjustsFontSizeToFit,
}: ClickableTextProps) => (
  <TouchableOpacity style={viewStyle} onPress={onPress}>
    <Text adjustsFontSizeToFit={adjustsFontSizeToFit} style={textStyle}>
      {text}
    </Text>
  </TouchableOpacity>
);

export default ClickableText;
