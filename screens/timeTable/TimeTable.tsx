import React, { useEffect, useState } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { cacheTimeTableData, getTimeTableData } from '../../data/timeTable';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { IGetProps } from '../../models/timeTable';
import { signOut } from '../../redux/reducers/authSlice';
import { addFetchedWeek, setData, setCurrentWeek, changeSelectedWeek } from '../../redux/reducers/timeTableSlice';
import { TimeTableState } from '../../redux/reducers/timeTableSlice';
import DayArray from './DayArray';

const TimeTable = () => {
  const dispatch = useAppDispatch();

  const { fetchedWeeks, data, selectedWeek, currentWeek }: TimeTableState = useAppSelector((state) => state.timeTable);
  const [isLoading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);

    const payload: IGetProps = {
      week: selectedWeek,
      useCacheFirst:
        (data && selectedWeek < currentWeek) || fetchedWeeks.includes(selectedWeek),
    };

    const result = await getTimeTableData(payload);

    if (result.isLoginPage) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    // Obviously this is real current week
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
    <Screen headerText="Расписание" onUpdate={loadData}>
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
