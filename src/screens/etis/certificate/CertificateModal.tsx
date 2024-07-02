import React from 'react';
import { Modal, View } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

const getStyles = (textColor: string): string => `
* {
  color: ${textColor};
  margin-left: 3%
}
`;

export default function CertificateModal({ html, closeModal }) {
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
          globalStyles.block,
          globalStyles.border,
          globalStyles.shadow,
        ]}
      >
        <AutoHeightWebView
          source={{ html }}
          scalesPageToFit
          style={{ marginHorizontal: '20%', marginVertical: '3%' }}
          customStyle={getStyles(globalStyles.fontColorForBlock.color)}
        />
        <ClickableText
          text={'Закрыть'}
          onPress={closeModal}
          textStyle={fontSize.large}
          viewStyle={{ marginBottom: '2%' }}
          colorVariant={'block'}
        />
      </View>
    </Modal>
  );
}
