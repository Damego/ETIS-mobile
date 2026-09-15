import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';

const AddButton = ({ onPress }: { readonly onPress: () => void }) => {
  const globalStyles = useGlobalStyles();
  const { t } = useTranslation();
  return (
    <ClickableText textStyle={[globalStyles.primaryText, styles.text]} onPress={onPress}>
      {t('common.add')}
    </ClickableText>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
  },
});
