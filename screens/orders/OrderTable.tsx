import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { useDispatch } from 'react-redux';

import Card from '../../components/Card';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { useGlobalStyles } from '../../hooks';
import { IOrder } from '../../models/order';
import parseOrders from '../../parser/order';
import { isLoginPage } from '../../parser/utils';
import { signOut } from '../../redux/reducers/authSlice';
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

const OrderTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<IOrder[]>(null);
  const [activeOrder, setActiveOrder] = useState<IOrder>(null);
  const globalStyles = useGlobalStyles();

  const loadData = async () => {
    const html = await httpClient.getOrders();
    if (!html) {
      return;
    }

    if (isLoginPage(html)) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    const parsedData = parseOrders(html);
    setData(parsedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen headerText="Приказы" />;
  return (
    <Screen headerText="Приказы" onUpdate={loadData}>
      {data.map((order, index) => (
        <Card key={index}>
          <Text
            onPress={() => {
              if (activeOrder && order.id == activeOrder.id) {
                setActiveOrder(null);
              } else {
                if (order.url) {
                  setActiveOrder(order);
                } else {
                  ToastAndroid.show('Ссылка недоступна', ToastAndroid.SHORT);
                }
              }
            }}
            style={[styles.fontS14, styles.fontW500, globalStyles.textColor]}
          >
            {`№${order.id} от ${order.date}
${order.name}`}
          </Text>
          {activeOrder !== null && activeOrder.id === order.id && <AutoHeightWebView
              source={{ uri: order.url }}
              style={{ alignSelf: 'center', width: '130%' }}
              viewportContent={'user-scalable=no'}
              scalesPageToFit={true}
              customStyle={`${getStyles(globalStyles.textColor.color)}`}
              injectedJavaScript={
                `document.cookie = ${httpClient.sessionID}` /* Allows download files */
              }
            />}
        </Card>
      ))}
    </Screen>
  );
};

export default OrderTable;