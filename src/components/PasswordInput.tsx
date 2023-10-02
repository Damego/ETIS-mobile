import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    marginRight: '1%',
    right: 0
  }
});

interface ExtendedTextInputProps extends TextInputProps {
  autoComplete: 'password' | 'password-new';
}

const PasswordInput = (props: ExtendedTextInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <TextInput {...props} secureTextEntry={!showPassword} />
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setShowPassword((prev) => !prev)}
      >
        <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
