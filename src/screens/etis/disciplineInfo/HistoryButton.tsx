import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

const HistoryButton = ({ onPress, showHistory }: { onPress: () => void; showHistory: boolean }) => {
  const globalStyles = useGlobalStyles();

  return (
    <ClickableText
      text={`История заданий`}
      onPress={onPress}
      textStyle={fontSize.big}
      viewStyle={styles.showInactiveButton}
      iconLeft={<Ionicons name={'time-outline'} size={26} color={globalStyles.textColor2.color} />}
      iconRight={
        <Ionicons
          name={showHistory ? 'arrow-up-outline' : 'arrow-down-outline'}
          style={{ marginLeft: 'auto' }}
          size={22}
          color={globalStyles.textColor2.color}
        />
      }
    />
  );
};

export default HistoryButton;

const styles = StyleSheet.create({
  showInactiveButton: {
    paddingVertical: '1%',
    marginTop: '2%',
    gap: 4,
  },
});
