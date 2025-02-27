import React from 'react';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { useAppSelector } from '~/hooks';

// Скрытие панели навигации
const mapsStyle = `
#root div:nth-child(1) {
  flex: 0 0 100% !important;
}

#root > div > div:nth-child(2) {
  display: none !important;
}
`;

const getScript = (ical: string) => `localStorage.setItem("ical_token", "${ical}");`;

function Maps() {
  const { iCalToken } = useAppSelector((state) => state.student);

  return (
    <AutoHeightWebView
      style={{ flex: 1 }}
      source={{
        uri: `https://deploy-preview-86--psumaps-miniapp.netlify.app`,
      }}
      customStyle={mapsStyle}
      customScript={getScript(iCalToken)}
      domStorageEnabled
    />
  );
}

export default React.memo(Maps);
