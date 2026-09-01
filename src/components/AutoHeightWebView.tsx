import React from 'react';
import { Platform } from 'react-native';
import AutoHeightWebViewLib, {
  AutoHeightWebViewProps,
} from 'react-native-autoheight-webview';

// react-native-autoheight-webview v1.6.5 задаёт свои платформенные дефолты
// (scalesPageToFit: false на Android, viewportContent на iOS, скрытые скроллбары,
// originWhitelist) через defaultProps, но React 19 не применяет defaultProps
// у функциональных компонентов. Без scalesPageToFit: false WebView на Android
// открывается в overview-режиме (viewport ~980px, сжимается под ширину экрана):
// текст становится нечитаемо мелким, а высота карточек не соответствует содержимому.
// Возвращаем дефолты библиотеки вручную.
export default function AutoHeightWebView(props: AutoHeightWebViewProps) {
  const platformDefaults =
    Platform.OS === 'android'
      ? { scalesPageToFit: false as const }
      : { viewportContent: 'width=device-width' as const };

  return (
    <AutoHeightWebViewLib
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      originWhitelist={['*']}
      {...platformDefaults}
      {...props}
    />
  );
}
