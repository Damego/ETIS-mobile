import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { cacheTeacherData, getTeacherData } from '../../data/teachers';
import { IGetPayload } from '../../models/results';
import { TeacherType } from '../../models/teachers';
import { signOut } from '../../redux/reducers/authSlice';
import TeacherCard from './TeacherCard';

const TeacherTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<TeacherType>(null);

  const loadData = async () => {
    const payload: IGetPayload = {
      useCache: true,
      useCacheFirst: false,
    };
    const result = await getTeacherData(payload);

    if (result.isLoginPage) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    setData(result.data);
    if (result.fetched) {
      cacheTeacherData(result.data)
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen headerText="Преподаватели" />;

  return (
    <Screen headerText="Преподаватели" onUpdate={loadData}>
      {data.map(([discipline, teachers]) => (
        <TeacherCard discipline={discipline} teachers={teachers} key={discipline} />
      ))}
    </Screen>
  );
};

export default TeacherTable;
