import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import NoDataView from '../../components/NoDataView';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppSelector } from '../../hooks';
import { IOrder } from '../../models/order';
import { GetResultType, RequestType } from '../../models/results';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import Order from './Order';

const OrderTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<IOrder[]>();
  const [isLoading, setLoading] = useState(false);
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const client = getWrappedClient();

  const loadData = async () => {
    setLoading(true);
    const result = await client.getOrdersData({ requestType: RequestType.tryFetch });

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      if (!data) setLoading(false);
      ToastAndroid.show('Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (isLoading) return <LoadingScreen onRefresh={loadData} />;
  if (!data) return <NoDataView text="Возникла ошибка при загрузке данных" onRefresh={loadData} />;

  return (
    <Screen onUpdate={loadData}>
      {data.map((order, index) => (
        <Order key={index} order={order} />
      ))}
    </Screen>
  );
};

export default OrderTable;
