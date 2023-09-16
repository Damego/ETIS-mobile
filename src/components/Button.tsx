import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

export const styles = StyleSheet.create({
  container: {
    height: '12%',
    width: '90%',
    marginTop: '5%',
    paddingHorizontal: '5%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...fontSize.xlarge,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

const Button = ({
  text,
  onPress,
  disabled,
  textStyle,
  viewStyle
}: {
  text: string;
  onPress(): void;
  disabled?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[styles.container, globalStyles.primaryBackgroundColor, viewStyle]}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const LoadingButton = () => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.container, globalStyles.primaryBackgroundColor]}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
};

export { Button, LoadingButton };
