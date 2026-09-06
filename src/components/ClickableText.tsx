import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

import { IThemeColors } from '~/styles/themes';

import Text, { TextProps } from './Text';

interface ClickableTextProps extends TouchableOpacityProps {
  readonly text?: string | number;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly viewStyle?: StyleProp<ViewStyle>;
  onPress(): void;
  readonly adjustsFontSizeToFit?: boolean;
  readonly colorVariant?: '' | keyof IThemeColors;
  readonly iconLeft?: React.ReactNode;
  readonly iconRight?: React.ReactNode;
  readonly bottomComponent?: React.ReactNode;
  readonly textProps?: TextProps;
}

const ClickableText = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ClickableTextProps>(
  (
    {
      text,
      textStyle,
      viewStyle,
      adjustsFontSizeToFit,
      colorVariant,
      iconLeft,
      iconRight,
      children,
      bottomComponent,
      textProps,
      ...props
    },
    ref
  ) => (
    <TouchableOpacity ref={ref} style={[styles.container, viewStyle]} {...props}>
      {iconLeft}
      <View>
        <Text
          adjustsFontSizeToFit={adjustsFontSizeToFit}
          style={textStyle}
          colorVariant={colorVariant}
          {...textProps}
        >
          {text || children}
        </Text>
        {bottomComponent}
      </View>
      {iconRight}
    </TouchableOpacity>
  )
);

export default ClickableText;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
