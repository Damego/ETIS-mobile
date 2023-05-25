import React, { useEffect, useState } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { cacheTimeTableData, getTimeTableData } from '../../data/timeTable';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { IGetProps } from '../../models/timeTable';
import { signOut } from '../../redux/reducers/authSlice';
import {
  addFetchedWeek,
  changeSelectedWeek,
  setCurrentWeek,
  setData,
} from '../../redux/reducers/timeTableSlice';
import { TimeTableState } from '../../redux/reducers/timeTableSlice';
import DayArray from './DayArray';

const TimeTable = () => {
  const dispatch = useAppDispatch();

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

    const payload: IGetProps = {
      week: selectedWeek,
      useCacheFirst,
      useCache: true // Если не получится получить данные, будем использовать кэшированные данные
    };
    const result = await getTimeTableData(payload);

    if (result.isLoginPage) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    // Очевидно, что это будет текущей неделей
    if (!data) dispatch(setCurrentWeek(result.data.selectedWeek));

    dispatch(setData(result.data));
    setLoading(false);

    if (result.fetched) {
      dispatch(addFetchedWeek(result.data.selectedWeek));
      await cacheTimeTableData(
        result.data,
        currentWeek === undefined ? undefined : result.data.selectedWeek
      );
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedWeek]);

  if (!data || isLoading) return <LoadingScreen headerText="Расписание" />;

  return (
    <Screen headerText="Расписание" onUpdate={() => loadData(true)}>
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