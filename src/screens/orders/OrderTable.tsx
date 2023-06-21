import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { getOrdersData } from '../../data/orders';
import { IOrder } from '../../models/order';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import Order from './Order';
import { ToastAndroid } from 'react-native';
import { useAppSelector } from '../../hooks';

const OrderTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<IOrder[]>(null);
  const { isAuthorizing } = useAppSelector((state) => state.auth);

  const loadData = async () => {
    const result = await getOrdersData({ useCache: true, useCacheFirst: false });

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (!data) return <LoadingScreen />;

  return (
    <Screen onUpdate={loadData}>
      {data.map((order, index) => (
        <Order key={index} order={order} />
      ))}
    </Screen>
  );
};

export default OrderTable;
