import { AntDesign } from '@expo/vector-icons';
import React from 'react';

import SettingRow from '~/components/SettingRow';
import { useAppTheme } from '~/hooks/theme';
import { IThemeColors } from '~/styles/themes';

const BaseSettingButton = ({
  iconName,
  label,
  onPress,
  color,
}: {
  iconName: keyof typeof AntDesign.glyphMap;
  label: string;
  onPress: () => void;
  color?: keyof IThemeColors;
}) => {
  const theme = useAppTheme();
  const $color = color ? theme.colors[color] : theme.colors.text;

  return (
    <SettingRow
      icon={<AntDesign name={iconName} size={24} color={$color} />}
      label={label}
      labelColorVariant={color}
      onPress={onPress}
    />
  );
};
export default BaseSettingButton;
