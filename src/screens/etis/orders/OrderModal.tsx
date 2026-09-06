import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, View } from 'react-native';

import AutoHeightWebView from '~/components/AutoHeightWebView';
import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

const getStyles = (textColor: string): string => `
* {
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${textColor};
}
`;

export default function OrderModal({
  html,
  closeModal,
}: {
  readonly html: string;
  readonly closeModal: () => void;
}) {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  return (
    <Modal transparent onRequestClose={closeModal}>
      <View style={[styles.container, globalStyles.card, globalStyles.border]}>
        <AutoHeightWebView
          scalesPageToFit
          source={{ html }}
          style={{ marginHorizontal: '20%' }}
          customStyle={getStyles(globalStyles.textColor.color)}
        />
        <ClickableText
          text={t('common.close')}
          textStyle={[fontSize.large, globalStyles.textColor]}
          viewStyle={{ marginBottom: '2%' }}
          onPress={closeModal}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginVertical: '20%',
    marginHorizontal: '2%',
  },
});
