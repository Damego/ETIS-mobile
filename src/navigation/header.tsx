import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { ITheme } from '~/styles/themes';

export type HeaderParamList = {
  /**
   * Style object for header. Supported properties:
   * - backgroundColor
   */
  headerStyle?: StyleProp<{
    backgroundColor?: string;
    borderRadius?: number;
  }>;
  /**
   * Function which returns a React Element to render as the background of the header.
   * This is useful for using backgrounds such as an image, a gradient, blur effect etc.
   * You can use this with `headerTransparent` to render content underneath a translucent header.
   */
  headerBackground?: () => React.ReactNode;
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to screen `title` or route name.
   *
   * When a function is passed, it receives `tintColor` and`children` in the options object as an argument.
   * The title string is passed in `children`.
   *
   * Note that if you render a custom element by passing a function, animations for the title won't work.
   */
  headerTitle?:
    | string
    | ((props: {
        /**
         * The title text of the header.
         */
        children: string;
        /**
         * Tint color for the header.
         */
        tintColor?: string;
      }) => React.ReactNode);
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
    backgroundColor: theme.colors.container,
    borderRadius: 30,
  },
  headerTitleStyle: {
    color: theme.colors.text,
    fontSize: 30,
    fontFamily: 'Ubuntu-Bold',
  },
  headerBackground: null,
  headerShadowVisible: false,
  headerTitleAlign: 'center',
});
