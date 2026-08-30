import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '~/components/Button';
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
  onRetry,
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
  onRetry?: () => void;
}) => {
  const globalStyles = useGlobalStyles();

  const contextData = useMemo(
    () => ({ teachers, currentDate, selectedDate }),
    [teachers, currentDate, selectedDate]
  );

  const shouldRenderNavigator = (Boolean(firstWeek) && Boolean(lastWeek)) || Boolean(data);

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
      {loadingComponent !== undefined && isLoading
        ? (
          loadingComponent()
        )
        : data?.weekInfo?.dates
          ? (
            <>
              <DatesContainer dates={data.weekInfo.dates} />

              <TimeTableContext.Provider value={contextData}>
                {isHolidayWeek(data.weekInfo)
                  ? (
                    <HolidayView holidayInfo={data.weekInfo.holidayDates} />
                  )
                  : (
                    <DayArray data={data.days} weekDates={data.weekInfo.dates} />
                  )}
              </TimeTableContext.Provider>
            </>
          )
          : (
            <View style={styles.emptyContainer}>
              <CenteredText>Нет расписания</CenteredText>
              {onRetry && <Button text='Обновить' onPress={onRetry} variant='card' />}
            </View>
          )}
    </View>
  );
};

export default React.memo(WeekTimeTable);

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    gap: 8,
  },
});
