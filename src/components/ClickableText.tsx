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

import Text from './Text';

interface ClickableTextProps extends TouchableOpacityProps {
  text?: string | number;
  textStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  onPress(): void;
  adjustsFontSizeToFit?: boolean;
  colorVariant?: keyof IThemeColors;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  bottomComponent?: React.ReactNode;
}

const ClickableText = React.forwardRef<TouchableOpacity, ClickableTextProps>(
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
      ...props
    },
    ref
  ) => {
    return (
      <TouchableOpacity style={[styles.container, viewStyle]} ref={ref} {...props}>
        {iconLeft}
        <View>
          <Text
            adjustsFontSizeToFit={adjustsFontSizeToFit}
            style={textStyle}
            colorVariant={colorVariant}
          >
            {text || children}
          </Text>
          {bottomComponent}
        </View>
        {iconRight}
      </TouchableOpacity>
    );
  }
);

export default ClickableText;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
