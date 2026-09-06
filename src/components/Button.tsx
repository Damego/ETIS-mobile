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
    borderRadius: 50,
  },
});

interface ButtonProps {
  readonly text: string;
  onPress(): void;
  readonly disabled?: boolean;
  readonly showLoading?: boolean;
  readonly variant: 'primary' | 'secondary' | 'card';
  readonly fontStyle?: StyleProp<TextStyle>;
}

const Button = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  ({ text, onPress, disabled, showLoading, variant, fontStyle }, ref) => {
    const globalStyles = useGlobalStyles();

    const styles = {
      primary: {
        textColor: globalStyles.textColor.color,
        text: [
          globalStyles.primaryContrastText,
          { fontWeight: '500' as const },
          fontStyle || fontSize.xlarge,
        ],
        view: [defaultStyles.container, globalStyles.primaryBackgroundColor],
      },
      secondary: {
        textColor: globalStyles.textColor.color,
        text: [
          globalStyles.secondaryContrastText,
          { fontWeight: '500' as const },
          fontStyle || fontSize.xlarge,
        ],
        view: [defaultStyles.container, globalStyles.secondaryBackgroundColor],
      },
      card: {
        textColor: globalStyles.textColor.color,
        text: [globalStyles.textColor, { fontWeight: '500' as const }, fontStyle || fontSize.xlarge],
        view: [defaultStyles.container, { backgroundColor: globalStyles.card.backgroundColor }],
      },
    };

    if (showLoading) {
      return (
        <View ref={ref as React.Ref<View>} style={styles[variant].view}>
          <ActivityIndicator size='large' color={styles[variant].textColor} />
        </View>
      );
    }

    if (disabled) {
      return (
        <View ref={ref as React.Ref<View>} style={styles[variant].view}>
          <Text style={styles[variant].text as StyleProp<TextStyle>}>{text}</Text>
        </View>
      );
    }

    return (
      <ClickableText
        ref={ref as React.Ref<React.ElementRef<typeof TouchableOpacity>>}
        text={text}
        textStyle={styles[variant].text as StyleProp<TextStyle>}
        viewStyle={styles[variant].view}
        onPress={onPress}
      />
    );
  }
);

export { Button };
