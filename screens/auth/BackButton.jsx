import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const BackButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} >
    <Text style={{fontSize: 20}}>Назад</Text>
  </TouchableOpacity>
);

export default BackButton;
