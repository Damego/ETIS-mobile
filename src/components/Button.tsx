import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

export const styles = StyleSheet.create({
  container: {
    width: '90%',
    paddingVertical: '3%',
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
}: {
  text: string;
  onPress(): void;
  disabled?: boolean;
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[
        styles.container,
        globalStyles.primaryBackgroundColor,
        disabled ? { opacity: 0.5 } : undefined,
      ]}
      disabled={disabled}
    >
      <Text style={styles.text}>{text}</Text>
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
