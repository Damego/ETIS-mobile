import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

import { ITheme } from '~/styles/themes';

export type HeaderParamList = {
  /**
   * Style object for header. Supported properties:
   * - backgroundColor
   */
  headerStyle?: StyleProp<{ backgroundColor?: string }>;
  /**
   * Style object for header title. Supported properties:
   * - fontFamily
   * - fontSize
   * - fontWeight
   * - color
   */
  headerTitleStyle?: StyleProp<
  	Pick<TextStyle, 'fontFamily' | 'fontSize' | 'fontWeight'> & {
  	  color?: string;
  	}
  >;
  /*
   * Whether to show the shadow of the header
   */
  headerShadowVisible?: boolean;
  headerTitleAlign?: 'left' | 'center';
};

export const headerParams = (theme: ITheme): HeaderParamList => ({
  headerStyle: {
    backgroundColor: theme.colors.background,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
  } as StyleProp<{ backgroundColor?: string }>,
  headerTitleStyle: {
    color: theme.colors.text,
    fontSize: 30,
    fontFamily: 'Ubuntu-Bold',
  },
  headerShadowVisible: false,
  headerTitleAlign: 'center',
});

export const progressiveHeaderShadowStyle = (theme: ITheme, offset: number) => ({
  ...headerParams(theme).headerStyle,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 12,
  },
  shadowOpacity: 0.58,
  shadowRadius: 16.0,

  elevation: offset,
});
