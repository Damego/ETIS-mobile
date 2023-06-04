import React from 'react';
import { Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface ClickableTextProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  onPress(): void;
}

const ClickableText = ({ text, textStyle, viewStyle, onPress }: ClickableTextProps) => (
  <TouchableOpacity style={viewStyle} onPress={onPress}>
    <Text style={textStyle}>{text}</Text>
  </TouchableOpacity>
);

export default ClickableText;
