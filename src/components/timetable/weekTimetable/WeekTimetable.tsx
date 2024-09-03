import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import CenteredText from '~/components/CenteredText';
import PageNavigator from '~/components/PageNavigator';
import TimeTableContext from '~/context/timetableContext';
import { useGlobalStyles } from '~/hooks';
import { ITeacher } from '~/models/teachers';
import { ITimeTable, WeekInfo, WeekTypes } from '~/models/timeTable';

import DatesContainer from './components/DatesContainer';
import DayArray from './components/DayArray';
import HolidayView from './components/HolidayView';

const isHolidayWeek = (weekInfo: WeekInfo) => {
  if (weekInfo.type !== WeekTypes.holiday) return false;

  const weekStart = dayjs(weekInfo.dates.start, 'DD.MM.YYYY');
  const holidayStart = dayjs(weekInfo.holidayDates.start, 'DD.MM.YYYY');

  // Если каникулы заканчиваются на следующей неделе от её начала,
  // то тип недели уже не является каникулами,
  // поэтому нет смысла проверять отдельно на конец недели
  return weekStart >= holidayStart;
};

const WeekTimeTable = ({
  data,
  currentDate,
  currentWeek,
  selectedDate,
  selectedWeek,
  teachers,
  onWeekPress,
  firstWeek,
  lastWeek,
  isLoading,
  loadingComponent,
}: {
  data: ITimeTable;
  currentDate: dayjs.Dayjs;
  currentWeek: number;
  selectedDate: dayjs.Dayjs;
  selectedWeek: number;
  teachers: ITeacher[];
  onWeekPress: (week: number) => void;
  firstWeek?: number;
  lastWeek?: number;
  isLoading?: boolean;
  loadingComponent?: () => React.ReactNode;
}) => {
  const globalStyles = useGlobalStyles();

  const contextData = useMemo(() => ({ teachers, currentDate }), [teachers, currentDate]);

  const shouldRenderNavigator = (!!firstWeek && !!lastWeek) || !!data;

  return (
    <View style={{ flex: 1 }}>
      {shouldRenderNavigator && (
        <PageNavigator
          firstPage={firstWeek ?? data.weekInfo.first}
          lastPage={lastWeek ?? data.weekInfo.last}
          currentPage={selectedWeek}
          onPageChange={onWeekPress}
          pageStyles={{
            [currentWeek]: {
              view: {
                borderWidth: 2,
                borderRadius: 50,
                borderColor: globalStyles.primaryText.color,
              },
            },
          }}
        />
      )}
      {/* eslint-disable-next-line no-nested-ternary */}
      {loadingComponent !== undefined && isLoading ? (
        loadingComponent()
      ) : data ? (
        <>
          <DatesContainer dates={data.weekInfo.dates} />

          <TimeTableContext.Provider value={contextData}>
            {isHolidayWeek(data.weekInfo) ? (
              <HolidayView holidayInfo={data.weekInfo.holidayDates} />
            ) : (
              <DayArray data={data.days} weekDates={data.weekInfo.dates} />
            )}
          </TimeTableContext.Provider>
        </>
      ) : (
        <CenteredText>Нет расписания</CenteredText>
      )}
    </View>
  );
};

export default React.memo(WeekTimeTable);
