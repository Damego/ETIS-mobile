import React from 'react';
import { StyleSheet } from 'react-native';
import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';

const AddButton = ({ onPress }: { onPress: () => void }) => {
  const globalStyles = useGlobalStyles();
  return (
    <ClickableText onPress={onPress} textStyle={[globalStyles.primaryText, styles.text]}>
      Добавить
    </ClickableText>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
  },
});
