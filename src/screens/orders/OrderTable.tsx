import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { IOrder } from '../../models/order';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import Order from './Order';
import { ToastAndroid } from 'react-native';
import { useAppSelector } from '../../hooks';
import { getWrappedClient } from '../../data/client';
import { GetResultType, RequestType } from '../../models/results';

const OrderTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<IOrder[]>(null);
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const client = getWrappedClient();

  const loadData = async () => {
    const result = await client.getOrdersData({ requestType: RequestType.tryFetch });

    if (result.type === GetResultType.loginPage) {
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

  if (!data) return <LoadingScreen onRefresh={loadData} />;

  return (
    <Screen onUpdate={loadData}>
      {data.map((order, index) => (
        <Order key={index} order={order} />
      ))}
    </Screen>
  );
};

export default OrderTable;
