import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import {
  StyleSheet, TextInput, TextInputProps, TouchableOpacity, View
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    marginRight: '2%',
    right: 0,
  },
});

interface PasswordInputProps extends TextInputProps {
  readonly autoComplete: 'password' | 'password-new';
  readonly iconColor: string;
}

const PasswordInput = (props: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { iconColor } = props;

  return (
    <View style={styles.container}>
      { }
      <TextInput {...props} secureTextEntry={!showPassword} />
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setShowPassword((prev) => !prev)}
      >
        <Ionicons
          name={showPassword ? 'eye-off' : 'eye'}
          size={24}
          color={iconColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
