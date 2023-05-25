import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ClickableText = ({ text, textStyle, viewStyle, onPress }) => (
  <TouchableOpacity style={viewStyle} onPress={onPress}>
    <Text style={textStyle}>{text}</Text>
  </TouchableOpacity>
);

export default ClickableText;
