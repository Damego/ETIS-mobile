import React from 'react';
import {
  StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle
} from 'react-native';

import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

interface SettingRowProps {
  label: string;
  icon?: React.ReactNode;
  /** Кнопка-подсказка («i») — зафиксирована справа, перед элементом управления */
  hint?: React.ReactNode;
  /** Элемент управления: switch, значение или шеврон */
  right?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Единая строка настроек: иконка слева, подпись, справа — подсказка и элемент
 * управления. Общие отступы и minHeight делают все строки одной высоты,
 * а подпись с flex: 1 прижимает подсказку и контрол к правому краю.
 */
const SettingRow = ({ label, icon, hint, right, onPress, style }: SettingRowProps) => {
  const globalStyles = useGlobalStyles();

  const rowStyle = [globalStyles.card, styles.row, style];

  const content = (
    <>
      {icon}
      <Text style={styles.label}>{label}</Text>
      {hint}
      {right}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={rowStyle} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={rowStyle}>{content}</View>;
};

export default SettingRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: '3%',
    paddingVertical: '3%',
  },
  label: {
    ...fontSize.medium,
    fontWeight: '500',
    flex: 1,
  },
});
