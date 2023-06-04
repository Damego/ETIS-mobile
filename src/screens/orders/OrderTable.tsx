import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { IOrder } from '../../models/order';
import parseOrders from '../../parser/order';
import { isLoginPage } from '../../parser/utils';
import { signOut } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import Order from './Order';

const OrderTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<IOrder[]>(null);
  const [activeOrder, setActiveOrder] = useState<IOrder>(null);

  const loadData = async () => {
    const html = await httpClient.getOrders();
    if (!html) {
      return;
    }

    if (isLoginPage(html)) {
      dispatch(signOut());
      return;
    }

    const parsedData = parseOrders(html);
    setData(parsedData);
  };

  const showOrder = (order) => {
    if (activeOrder && order.id == activeOrder.id) {
      setActiveOrder(null);
    } else if (order.url) {
      setActiveOrder(order);
    } else {
      ToastAndroid.show('Ссылка недоступна', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen />;

  return (
    <Screen onUpdate={loadData}>
      {data.map((order, index) => (
        <Order
          key={index}
          onPress={() => showOrder(order)}
          order={order}
          activeOrder={activeOrder}
        />
      ))}
    </Screen>
  );
};

export default OrderTable;
