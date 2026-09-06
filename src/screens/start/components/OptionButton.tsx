import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { StyleSheet } from 'react-native';

import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

const OptionButton = ({
  isPressed,
  onPress,
  disabled,
  children,
  bottomComponent,
}: {
  readonly isPressed: boolean;
  readonly onPress: () => void;
  readonly disabled?: boolean;
  readonly children: React.ReactNode;
  readonly bottomComponent?: React.ReactNode;
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <ClickableText
      disabled={disabled}
      viewStyle={[
        styles.buttonView,
        isPressed ? globalStyles.primaryBorder : [globalStyles.card, globalStyles.invisibleBorder],
        disabled && styles.buttonDisabled,
      ]}
      iconRight={isPressed ? <AntDesign name={'checkcircle'} color={globalStyles.primaryText.color} size={20} /> : null}
      textStyle={[styles.buttonText, disabled && globalStyles.textColor2]}
      bottomComponent={bottomComponent}
      onPress={onPress}
    >
      {children}
    </ClickableText>
  );
};

export default OptionButton;

const styles = StyleSheet.create({
  buttonView: {
    paddingVertical: '8%',
    paddingHorizontal: '4%',
    justifyContent: 'space-between',
    minWidth: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...fontSize.big,
    fontWeight: 'bold',
  },
});
