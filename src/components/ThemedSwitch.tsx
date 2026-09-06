import { Host, Switch } from '@expo/ui';
import React from 'react';

import { useAppTheme } from '~/hooks/theme';

interface ThemedSwitchProps {
  readonly value: boolean;
  readonly onValueChange: (value: boolean) => void;
  readonly disabled?: boolean;
}

/**
 * Обёртка над Switch из @expo/ui: Host с seedColor красит переключатель
 * в основной цвет темы вместо стандартного серого Material-переключателя.
 */
const ThemedSwitch = ({ value, onValueChange, disabled }: ThemedSwitchProps) => {
  const theme = useAppTheme();

  return (
    <Host matchContents seedColor={theme.colors.primary}>
      <Switch value={value} disabled={disabled} onValueChange={onValueChange} />
    </Host>
  );
};

export default ThemedSwitch;
