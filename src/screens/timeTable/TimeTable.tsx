import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';

import { cache } from '../../cache/smartCache';
import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { GetResultType, RequestType } from '../../models/results';
import { ITimeTableGetProps } from '../../models/timeTable';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import {
  TimeTableState,
  changeSelectedWeek,
  setCurrentWeek,
  setData,
} from '../../redux/reducers/timeTableSlice';
import DayArray from './DayArray';

const TimeTable = () => {
  const globalStyles = useGlobalStyles();
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const client = getWrappedClient();

  const { data, selectedWeek, currentWeek }: TimeTableState = useAppSelector(
    (state) => state.timeTable
  );
  const [isLoading, setLoading] = useState<boolean>(false);

  const loadData = async (forceFetch?: boolean) => {
    setLoading(true);

    const useCached =
      ((data && selectedWeek < currentWeek) || cache.hasTimeTableWeek(selectedWeek)) && !forceFetch;

    const payload: ITimeTableGetProps = {
      week: selectedWeek,
      requestType: useCached ? RequestType.tryCache : RequestType.tryFetch, // Если не получится получить данные, будем использовать кэшированные данные
    };
    const result = await client.getTimeTableData(payload);

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      setLoading(false);
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    // Очевидно, что это будет текущей неделей
    if (!data) dispatch(setCurrentWeek(result.data.selectedWeek));

    dispatch(setData(result.data));
    setLoading(false);
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
        pageStyles={{
          [currentWeek]: {
            view: {
              borderWidth: 2,
              borderRadius: globalStyles.border.borderRadius,
              borderColor: globalStyles.primaryFontColor.color,
            },
          },
        }}
      />

      <DayArray data={data.days} />
    </Screen>
  );
};

export default TimeTable;
