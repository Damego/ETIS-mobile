import React from 'react';
import { View } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

import Card from '../../components/Card';
import { httpClient } from '../../utils';

const style = `
* {
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  text-decoration: none;
  color: #CE2539
}
`;

export default function AnnounceCard({ data }) {
  return (
    <Card>
      <AutoHeightWebView
        originWhitelist={['*']}
        source={{ html: data }}
        style={{ flex: 0, width: '100%' }}
        customStyle={style}
        injectedJavaScript={`document.cookie = ${httpClient.sessionID}` /* Allows download files */}
      />
    </Card>
  );
}
