import React from 'react';
import AutoHeightWebView from 'react-native-autoheight-webview';

import Card from '../../components/Card';
import { useGlobalStyles } from '../../hooks';
import { httpClient } from '../../utils';

const getStyles = (textColor) => `
* {
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${textColor}
}

a {
  text-decoration: none;
  color: #427ADE
}
`;

export default function AnnounceCard({ data }) {
  const globalStyles = useGlobalStyles();

  return (
    <Card>
      <AutoHeightWebView
        originWhitelist={['*']}
        source={{ html: data }}
        style={{ flex: 0, width: '100%' }}
        customStyle={getStyles(globalStyles.textColor.color)}
        injectedJavaScript={`document.cookie = ${httpClient.sessionID}` /* Allows download files */}
      />
    </Card>
  );
}
