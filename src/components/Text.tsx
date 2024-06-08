import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import { useAppTheme } from '~/hooks/theme';

export type TextColorVariant =
  | 'primary'
  | 'primaryBlock'
  | 'secondary'
  | 'secondaryBlock'
  | 'block';

export interface TextProps extends RNTextProps {
  colorVariant?: TextColorVariant;
}

export default function Text({ colorVariant, style, ...props }: TextProps) {
  const theme = useAppTheme();

  const $style = React.useMemo(() => {
    const color: string =
      {
        primary: theme.colors.primary,
        primaryBlock: theme.colors.textForPrimary,
        secondary: theme.colors.secondary,
        secondaryBlock: theme.colors.textForSecondary,
        block: theme.colors.textForBlock,
      }[colorVariant] || theme.colors.text;

    return StyleSheet.compose({ color }, style);
  }, [colorVariant, style, theme]);
  return <RNText style={$style} {...props} />;
}
