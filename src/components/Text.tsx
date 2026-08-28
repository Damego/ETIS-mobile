import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';

import { useAppTheme } from '~/hooks/theme';
import { IThemeColors } from '~/styles/themes';

export interface TextProps extends RNTextProps {
  colorVariant?: '' | keyof IThemeColors;
}

const fontWeightToUbuntuFamily = {
  400: 'Ubuntu-Regular',
  500: 'Ubuntu-Medium',
  600: 'Ubuntu-Bold',
  700: 'Ubuntu-Bold',
  bold: 'Ubuntu-Bold',
};

const getFontFamily = (style: StyleProp<TextStyle>): string | undefined => {
  if (style instanceof Array) {
    for (const st of style) {
      const fontFamily = getFontFamily(st as StyleProp<TextStyle>);
      if (fontFamily) return fontFamily;
    }

    return undefined;
  }

  if (style && typeof style === 'object' && !Array.isArray(style)) {
    const { fontWeight } = (style);
    return fontWeightToUbuntuFamily[fontWeight as keyof typeof fontWeightToUbuntuFamily];
  }

  return undefined;
};

export default function Text({ colorVariant = 'text', style, ...props }: TextProps) {
  const theme = useAppTheme();

  const $style = React.useMemo(() => {
    const color: string = (colorVariant && colorVariant in theme.colors
      ? theme.colors[colorVariant]
      : theme.colors.text) || theme.colors.text;

    return StyleSheet.compose(
      { color, fontFamily: getFontFamily(style) || 'Ubuntu-Regular' },
      style
    );
  }, [colorVariant, style, theme]);
  return <RNText style={$style} {...props} />;
}
