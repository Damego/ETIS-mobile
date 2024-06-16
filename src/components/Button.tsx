import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontSize } from '~/utils/texts';

import { useGlobalStyles } from '../hooks';
import ClickableText from './ClickableText';

const defaultStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2%',
  },
});

interface ButtonProps {
  text: string;
  onPress(): void;
  disabled?: boolean;
  showLoading?: boolean;
  variant: 'primary' | 'secondary' | 'card';
  fontStyle?: StyleProp<TextStyle>;
}

const Button = React.forwardRef<View | Text | TouchableOpacity, ButtonProps>(
  ({ text, onPress, disabled, showLoading, variant, fontStyle }, ref) => {
    const globalStyles = useGlobalStyles();

    const styles = {
      primary: {
        textColor: globalStyles.textColor.color,
        text: [
          globalStyles.primaryContrastText,
          { fontWeight: '500' },
          fontStyle || fontSize.xlarge,
        ],
        view: [
          defaultStyles.container,
          globalStyles.primaryBackgroundColor,
          globalStyles.borderRadius,
        ],
      },
      secondary: {
        textColor: globalStyles.textColor.color,
        text: [
          globalStyles.secondaryContrastText,
          { fontWeight: '500' },
          fontStyle || fontSize.xlarge,
        ],
        view: [
          defaultStyles.container,
          globalStyles.secondaryBackgroundColor,
          globalStyles.borderRadius,
        ],
      },
      card: {
        textColor: globalStyles.secondaryContrastText.color,
        text: [globalStyles.secondaryText, { fontWeight: '500' }, fontStyle || fontSize.xlarge],
        view: [defaultStyles.container, globalStyles.borderRadius],
      },
    };

    if (showLoading) {
      return (
        <View style={styles[variant].view} ref={ref as React.Ref<View>}>
          <ActivityIndicator size="large" color={styles[variant].textColor} />
        </View>
      );
    }

    if (disabled) {
      return (
        <View style={styles[variant].view} ref={ref as React.Ref<View>}>
          <Text style={styles[variant].text}>{text}</Text>
        </View>
      );
    }

    return (
      <ClickableText
        ref={ref as React.Ref<TouchableOpacity>}
        text={text}
        onPress={onPress}
        textStyle={styles[variant].text}
        viewStyle={styles[variant].view}
      />
    );
  }
);

export { Button };
