import React from 'react';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';

const getScript = (ical: string, theme: 'light' | 'dark') => `
localStorage.setItem("ical_token", "${ical}");
localStorage.setItem("theme", "${theme}");

// Решения ниже не работают корректно если использовать css

const getElementByXPath = (XPath) => {
  const element = document.evaluate(XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return element.singleNodeValue;
}

// Удаление панели навигации
const navElem = getElementByXPath("/html/body/div/div/div[2]");
navElem.remove();

// Задание полной высоты для оставшегося блока
const searchElem = getElementByXPath("/html/body/div/div/div[1]");
searchElem.style.flex = "0 0 100%";
`;

function Maps() {
  const { iCalToken } = useAppSelector((state) => state.student);
  const theme = useAppTheme();

  return (
    <AutoHeightWebView
      style={{ flex: 1 }}
      source={{
        uri: `https://deploy-preview-86--psumaps-miniapp.netlify.app`,
      }}
      customScript={getScript(iCalToken, theme.dark ? 'dark' : 'light')}
      domStorageEnabled
    />
  );
}

export default React.memo(Maps);
