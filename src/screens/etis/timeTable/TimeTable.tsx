import dayjs from 'dayjs';
import React from 'react';
import LoadingScreen, { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import PageNavigator from '~/components/PageNavigator';
import Screen from '~/components/Screen';
import TimeTableContext from '~/context/timetableContext';
import { useClient } from '~/data/client';
import { useGlobalStyles } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import { WeekInfo, WeekTypes } from '~/models/timeTable';

import DatesContainer from './DatesContainer';
import DayArray from './DayArray';
import HolidayView from './HolidayView';

const isHolidayWeek = (weekInfo: WeekInfo) => {
  if (weekInfo.type !== WeekTypes.holiday) return false;

  const weekStart = dayjs(weekInfo.dates.start, 'DD.MM.YYYY');
  const holidayStart = dayjs(weekInfo.holidayDates.start, 'DD.MM.YYYY');

  // Если каникулы заканчиваются на следующей неделе от её начала,
  // то тип недели уже не является каникулами,
  // поэтому нет смысла проверять отдельно на конец недели
  return weekStart >= holidayStart;
};

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

  const currentDate = dayjs().startOf('day');

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
              borderColor: globalStyles.primaryText.color,
            },
          },
        }}
      />

      {isLoading || teachersIsLoading ? (
        <LoadingContainer />
      ) : (
        <>
          <DatesContainer dates={data.weekInfo.dates} />

          <TimeTableContext.Provider value={{ teachers: teachersData, currentDate }}>
            {isHolidayWeek(data.weekInfo) ? (
              <HolidayView holidayInfo={data.weekInfo.holidayDates} />
            ) : (
              <DayArray data={data.days} weekDates={data.weekInfo.dates} />
            )}
          </TimeTableContext.Provider>
        </>
      )}
    </Screen>
  );
};

export default TimeTable;
