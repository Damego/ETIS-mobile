import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';
import ClickableText from './ClickableText';

const defaultStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2%',
  },
});

const Button = ({
  text,
  onPress,
  disabled,
  showLoading,
  variant,
  fontStyle,
}: {
  text: string;
  onPress(): void;
  disabled?: boolean;
  showLoading?: boolean;
  variant: 'primary' | 'secondary' | 'card';
  fontStyle?: StyleProp<TextStyle>;
}) => {
  const globalStyles = useGlobalStyles();

  const styles = {
    primary: {
      textColor: globalStyles.textColor.color,
      text: [globalStyles.fontColorForPrimary, { fontWeight: '500' }, fontStyle || fontSize.xlarge],
      view: [
        defaultStyles.container,
        globalStyles.primaryBackgroundColor,
        globalStyles.borderRadius,
      ],
    },
    secondary: {
      textColor: globalStyles.textColor.color,
      text: [
        globalStyles.fontColorForSecondary,
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
      textColor: globalStyles.textColor.color,
      text: [globalStyles.textColor, { fontWeight: '500' }, fontStyle || fontSize.xlarge],
      view: [defaultStyles.container, globalStyles.block, globalStyles.border],
    },
  };

  if (showLoading) {
    return (
      <View style={styles[variant].view}>
        <ActivityIndicator size="large" color={styles[variant].textColor} />
      </View>
    );
  }

  if (disabled) {
    return (
      <View style={styles[variant].view}>
        <Text style={styles[variant].text}>{text}</Text>
      </View>
    );
  }

  return (
    <ClickableText
      text={text}
      onPress={onPress}
      textStyle={styles[variant].text}
      viewStyle={styles[variant].view}
    />
  );
};

export { Button };
