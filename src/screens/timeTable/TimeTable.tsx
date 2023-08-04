import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { getTimeTableData } from '../../data/timeTable';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ITimeTableGetProps, WeekTypes } from '../../models/timeTable';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import {
  addFetchedWeek,
  changeSelectedWeek,
  setCurrentWeek,
  setData,
  TimeTableState,
} from '../../redux/reducers/timeTableSlice';
import DayArray from './DayArray';
import HolidayView from "./HolidayView";

const TimeTable = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);

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

    const payload: ITimeTableGetProps = {
      week: selectedWeek,
      useCacheFirst,
      useCache: true, // Если не получится получить данные, будем использовать кэшированные данные
    };
    const result = await getTimeTableData(payload);

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      setLoading(false);
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    // Очевидно, что это будет текущей неделей
    if (!data) dispatch(setCurrentWeek(result.data.weekInfo.selected));

    dispatch(setData(result.data));
    setLoading(false);

    if (result.fetched) {
      dispatch(addFetchedWeek(result.data.weekInfo.selected));
    }
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [selectedWeek, isAuthorizing]);

  if (!data || isLoading) return <LoadingScreen onRefresh={loadData} />;

  return (
    <Screen onUpdate={() => loadData(true)}>
      <PageNavigator
        firstPage={data.weekInfo.first}
        lastPage={data.weekInfo.last}
        currentPage={data.weekInfo.selected}
        onPageChange={(week) => dispatch(changeSelectedWeek(week))}
      />

      {data.weekInfo.type === WeekTypes.common ? <DayArray data={data.days} /> : <HolidayView />}
    </Screen>
  );
};

export default TimeTable;
