import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  addFetchedWeek,
  changeSelectedWeek,
  setCurrentWeek,
  setData,
  TimeTableState,
} from '../../redux/reducers/timeTableSlice';
import DayArray from './DayArray';
import { getWrappedClient } from '../../data/client';
import { GetTimeTablePayload } from '../../data/types';
import { GetResultType } from '../../models/results';

const TimeTable = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const client = getWrappedClient();

  const { fetchedWeeks, data, selectedWeek, currentWeek }: TimeTableState = useAppSelector(
    (state) => state.timeTable
  );
  const [isLoading, setLoading] = useState<boolean>(false);

  const loadData = async (forceFetch?: boolean) => {
    setLoading(true);

    /*
    Идея в том, чтобы использовать кэш для предыдущих недель,
    так как они больше не обновлятся в ЕТИС
    и хранить кэшированные номера недель в стейте, чтобы не грузить их по новой
    */
    const useCacheFirst =
      ((data && selectedWeek < currentWeek) || fetchedWeeks.includes(selectedWeek)) && !forceFetch;

    const payload: GetTimeTablePayload = {
      forceFetch: false,
      week: selectedWeek,
      forceCache: useCacheFirst, // Если не получится получить данные, будем использовать кэшированные данные
    };
    const result = await client.getTimeTableData(payload);

    if (!result.data) {
      setLoading(false);
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    // Очевидно, что это будет текущей неделей
    if (!data) dispatch(setCurrentWeek(result.data.selectedWeek));

    dispatch(setData(result.data));
    setLoading(false);

    if (result.type === GetResultType.fetched) {
      dispatch(addFetchedWeek(result.data.selectedWeek));
    }
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [selectedWeek, isAuthorizing]);

  if (!data || isLoading) return <LoadingScreen onRefresh={loadData} />;

  return (
    <Screen onUpdate={() => loadData(true)}>
      <PageNavigator
        firstPage={data.firstWeek}
        lastPage={data.lastWeek}
        currentPage={data.selectedWeek}
        onPageChange={(week) => dispatch(changeSelectedWeek(week))}
      />

      <DayArray data={data.days} />
    </Screen>
  );
};

export default TimeTable;
