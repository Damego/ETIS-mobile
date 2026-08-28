import { Checkbox, Host } from '@expo/ui';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { useAppTheme } from '~/hooks/theme';

interface ThemedCheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Обёртка над Checkbox из @expo/ui: Host с seedColor красит чекбокс
 * в основной цвет темы (заменяет проп color из expo-checkbox).
 */
const ThemedCheckbox = ({ value, onValueChange, disabled, style }: ThemedCheckboxProps) => {
  const theme = useAppTheme();

  return (
    <Host matchContents seedColor={theme.colors.primary} style={style}>
      <Checkbox value={value} onValueChange={onValueChange} disabled={disabled} />
    </Host>
  );
};

export default ThemedCheckbox;
