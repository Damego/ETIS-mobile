import React from 'react';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Card from '~/components/Card';
import { useAppTheme } from '~/hooks/theme';
import { httpClient } from '~/utils';
import { getStyles } from '~/utils/webView';

export default function AnnounceCard({ data }: { data: string }) {
  const theme = useAppTheme();

  return (
    <Card>
      <AutoHeightWebView
        originWhitelist={['*']}
        source={{ html: data }}
        style={{ flex: 0, width: '100%' }}
        customStyle={getStyles(theme.colors.text, theme.colors.primary)}
        injectedJavaScript={
          `document.cookie = ${httpClient.getSessionID()}` /* Allows download files */
        }
      />
    </Card>
  );
}
