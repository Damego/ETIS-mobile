import React from 'react';
import { View } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

import Card from '../../components/Card';

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
      <View style={{ padding: '2%' }}>
        <AutoHeightWebView
          originWhitelist={['*']}
          source={{ html: data }}
          style={{ flex: 0, width: '100%' }}
          customStyle={style}
        />
      </View>
    </Card>
  );
}
