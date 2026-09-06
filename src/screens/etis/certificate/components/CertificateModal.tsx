import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View } from 'react-native';

import AutoHeightWebView from '~/components/AutoHeightWebView';
import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

const getStyles = (textColor: string): string => `
* {
  color: ${textColor};
  margin-left: 3%
}
`;

export default function CertificateModal({
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
      <View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginVertical: '20%',
            marginHorizontal: '2%',
          },
          globalStyles.container,
          globalStyles.border,
        ]}
      >
        <AutoHeightWebView
          scalesPageToFit
          source={{ html }}
          style={{ marginHorizontal: '20%', marginVertical: '3%' }}
          customStyle={getStyles(globalStyles.textColor.color)}
        />
        <ClickableText
          text={t('common.close')}
          textStyle={fontSize.large}
          viewStyle={{ marginBottom: '2%' }}
          onPress={closeModal}
        />
      </View>
    </Modal>
  );
}
