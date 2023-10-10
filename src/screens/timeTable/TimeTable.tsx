import React from 'react';

import LoadingScreen, { LoadingContainer } from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import { useGlobalStyles } from '../../hooks';
import useQuery from '../../hooks/useQuery';
import useTimeTableQuery from '../../hooks/useTimeTableQuery';
import { WeekTypes } from '../../models/timeTable';
import DatesContainer from './DatesContainer';
import DayArray from './DayArray';
import HolidayView from './HolidayView';

const TimeTable = () => {
  const globalStyles = useGlobalStyles();
  const client = useClient();
  const { data, isLoading, refresh, loadWeek, currentWeek } = useTimeTableQuery();
  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
  });

  if ((isLoading || teachersIsLoading) && (!data || !teachersData))
    return <LoadingScreen onRefresh={refresh} />;
  if (!data || !teachersData) return <NoData onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
      <PageNavigator
        firstPage={data.weekInfo.first}
        lastPage={data.weekInfo.last}
        currentPage={data.weekInfo.selected}
        onPageChange={loadWeek}
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

      {isLoading || teachersIsLoading ? (
        <LoadingContainer />
      ) : (
        <>
          <DatesContainer dates={data.weekInfo.dates} />

          {data.weekInfo.type === WeekTypes.holiday ? (
            <HolidayView holidayInfo={data.weekInfo.holidayDates} />
          ) : (
            <DayArray data={data.days} teachersData={teachersData} />
          )}
        </>
      )}
    </Screen>
  );
};

export default TimeTable;
