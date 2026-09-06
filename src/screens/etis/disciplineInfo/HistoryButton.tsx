import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';
import { fontSize, iconSize } from '~/utils/texts';

const HistoryButton = ({ onPress, showHistory }: { readonly onPress: () => void; readonly showHistory: boolean }) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  return (
    <ClickableText
      text={t('disciplineInfo.tasksHistory')}
      textStyle={fontSize.big}
      viewStyle={styles.showInactiveButton}
      iconLeft={<Ionicons name={'time-outline'} size={iconSize.medium} color={globalStyles.textColor.color} />}
      iconRight={
        <Ionicons
          name={showHistory ? 'arrow-up-outline' : 'arrow-down-outline'}
          style={{ marginLeft: 'auto' }}
          size={iconSize.medium}
          color={globalStyles.textColor.color}
        />
      }
      onPress={onPress}
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
