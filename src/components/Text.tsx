import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '~/hooks/theme';
import { IThemeColors } from '~/styles/themes';

export interface TextProps extends RNTextProps {
  colorVariant?: keyof IThemeColors;
}

const fontWeightToUbuntuFamily = {
  '400': 'Ubuntu-Regular',
  '500': 'Ubuntu-Medium',
  '600': 'Ubuntu-Bold',
  '700': 'Ubuntu-Bold',
  bold: 'Ubuntu-Bold',
};

const getFontFamily = (style: StyleProp<TextStyle>) => {
  if (style instanceof Array) {
    for (const st of style) {
      const fontFamily = getFontFamily(st);
      if (fontFamily) return fontFamily;
    }
  }
  if (style instanceof Object) {
    return fontWeightToUbuntuFamily[style?.fontWeight];
  }
};

export default function Text({ colorVariant = 'text', style, ...props }: TextProps) {
  const theme = useAppTheme();

  const $style = React.useMemo(() => {
    const color: string = theme.colors[colorVariant] || theme.colors.text;

    return StyleSheet.compose(
      { color, fontFamily: getFontFamily(style) || 'Ubuntu-Regular' },
      style
    );
  }, [colorVariant, style, theme]);
  return <RNText style={$style} {...props} />;
}
