import { Checkbox, Host } from '@expo/ui';
import React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import { IThemeColors } from '~/styles/themes';

interface ThemedCheckboxProps {
  readonly value: boolean;
  readonly onValueChange: (value: boolean) => void;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  /**
   * Подпись справа от чекбокса. При заданном label весь ряд кликабелен:
   * тап по тексту тоже переключает состояние.
   */
  readonly label?: string;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly labelColorVariant?: keyof IThemeColors;
}

/**
 * Обёртка над Checkbox из @expo/ui: Host с seedColor красит чекбокс
 * в основной цвет темы (заменяет проп color из expo-checkbox).
 *
 * С пропом label рендерит чекбокс и подпись одним кликабельным рядом —
 * иначе текст рядом с чекбоксом выглядит частью контрола, но не реагирует
 * на тап.
 */
const ThemedCheckbox = ({
  value,
  onValueChange,
  disabled,
  style,
  label,
  labelStyle,
  labelColorVariant,
}: ThemedCheckboxProps) => {
  const theme = useAppTheme();

  if (!label) {
    return (
      <Host matchContents seedColor={theme.colors.primary} style={style}>
        <Checkbox value={value} disabled={disabled} onValueChange={onValueChange} />
      </Host>
    );
  }

  return (
    <Host matchContents seedColor={theme.colors.primary} style={style}>
      <Pressable
        style={styles.labelRow}
        disabled={disabled}
        onPress={() => onValueChange(!value)}
      >
        <Checkbox value={value} disabled={disabled} onValueChange={onValueChange} />
        <Text
          colorVariant={labelColorVariant}
          style={[styles.label, labelStyle]}
        >
          {label}
        </Text>
      </Pressable>
    </Host>
  );
};

export default ThemedCheckbox;

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // flexShrink вместо flex:1 — текст переносится, а не растягивает ряд
  // там, где рядом стоит другой контент (ссылка восстановления пароля)
  label: {
    flexShrink: 1,
  },
});
