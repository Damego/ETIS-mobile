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
    marginRight: '2%',
    right: 0,
  },
});

interface PasswordInputProps extends TextInputProps {
  autoComplete: 'password' | 'password-new';
  iconColor: string;
}

const PasswordInput = (props: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { iconColor } = props;

  return (
    <View style={styles.container}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <TextInput {...props} secureTextEntry={!showPassword} />
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setShowPassword((prev) => !prev)}
      >
        <MaterialCommunityIcons
          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color={iconColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
