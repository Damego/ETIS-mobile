import React from 'react';
import { StyleSheet } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

import Card from '../../components/Card';
import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { httpClient } from '../../utils';

const styles = StyleSheet.create({
  fontW500: {
    fontWeight: '500',
  },
  fontS14: {
    fontSize: 14,
  },
});

const getStyles = (textColor) => `
* {
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${textColor}
}
`;

const Order = ({ onPress, order, activeOrder }) => {
  const globalStyles = useGlobalStyles();

  return (
    <Card>
      <ClickableText
        onPress={onPress}
        textStyle={[styles.fontS14, styles.fontW500, globalStyles.textColor]}
        text={`№${order.id} от ${order.date}\n${order.name}`} viewStyle={null}
      />

      {activeOrder !== null && activeOrder.id === order.id && (
        <AutoHeightWebView
          source={{ uri: order.url }}
          style={{ alignSelf: "center", width: "130%" }}
          viewportContent={"user-scalable=no"}
          scalesPageToFit={true}
          customStyle={`${getStyles(globalStyles.textColor.color)}`}
          injectedJavaScript={
            `document.cookie = ${httpClient.sessionID}`
          }
        />
      )}
    </Card>
  );
}

export default Order;