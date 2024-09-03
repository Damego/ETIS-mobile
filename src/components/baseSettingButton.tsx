import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from '~/components/Text';
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
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <AntDesign name={iconName} size={28} color={$color} />
      <Text style={styles.text} colorVariant={color}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '500',
    fontSize: 16,
  },
});
export default BaseSettingButton;
