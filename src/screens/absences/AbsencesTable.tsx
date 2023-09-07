import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppSelector } from '../../hooks';
import { GetResultType, IGetPayload, RequestType } from '../../models/results';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { IDisciplineAbsences } from '../../models/absences';
import Absences from './Absences';

const AbsencesTable = () => {
  const dispatch = useDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<IDisciplineAbsences[]>(null);
  const client = getWrappedClient();

  const loadData = async () => {
    setLoading(true);
    const payload: IGetPayload = {
      requestType: RequestType.tryFetch,
    };
    const result = await client.getAbsencesData(payload);

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
  if (!data) return <NoData onRefresh={loadData} />;
  if (!data.length) return <NoData text={'Записи о пропущенных занятиях отсутствуют'} onRefresh={loadData} />;

  return (
    <Screen onUpdate={loadData}>
      {data.map((absences, index) => (
          <Absences key={index} record={absences} />
      ))}
    </Screen>
  );
};

export default AbsencesTable;