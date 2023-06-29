import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { cacheTeacherData, getTeacherData } from '../../data/teachers';
import { useAppSelector } from '../../hooks';
import { IGetPayload } from '../../models/results';
import { TeacherType } from '../../models/teachers';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import TeacherCard from './TeacherCard';

const TeacherTable = () => {
  const dispatch = useDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);

  const [data, setData] = useState<TeacherType>(null);

  const loadData = async () => {
    const payload: IGetPayload = {
      useCache: true,
      useCacheFirst: false,
    };
    const result = await getTeacherData(payload);

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
    if (result.fetched) {
      cacheTeacherData(result.data);
    }
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (!data) return <LoadingScreen onRefresh={loadData} />;

  return (
    <Screen onUpdate={loadData}>
      {data.map(([discipline, teachers]) => (
        <TeacherCard discipline={discipline} teachers={teachers} key={discipline} />
      ))}
    </Screen>
  );
};

export default TeacherTable;
