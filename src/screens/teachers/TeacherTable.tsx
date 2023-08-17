import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import NoDataView from '../../components/NoDataView';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppSelector } from '../../hooks';
import { GetResultType, IGetPayload, RequestType } from '../../models/results';
import { TeacherType } from '../../models/teachers';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import TeacherCard from './TeacherCard';

const TeacherTable = () => {
  const dispatch = useDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<TeacherType>(null);
  const client = getWrappedClient();

  const loadData = async () => {
    setLoading(true);
    const payload: IGetPayload = {
      requestType: RequestType.tryFetch,
    };
    const result = await client.getTeacherData(payload);

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
      {data.map(([discipline, teachers]) => (
        <TeacherCard discipline={discipline} teachers={teachers} key={discipline} />
      ))}
    </Screen>
  );
};

export default TeacherTable;
