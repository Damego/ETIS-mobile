import React, { useRef } from 'react';
import { Text, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import useQuery from '../../hooks/useQuery';
import { RequestType } from '../../models/results';
import { WeekTypes } from '../../models/timeTable';
import { setCurrentWeek } from '../../redux/reducers/studentSlice';
import { fontSize } from '../../utils/texts';
import DayArray from './DayArray';
import HolidayView from './HolidayView';

const TimeTable = () => {
  const globalStyles = useGlobalStyles();
  const dispatch = useAppDispatch();
  const fetchedWeeks = useRef<number[]>([]);
  const { currentWeek } = useAppSelector((state) => state.student);
  const client = useClient();

  const { data, isLoading, refresh, update } = useQuery({
    method: client.getTimeTableData,
    payload: {
      requestType: RequestType.tryFetch,
    },
    onFail: async () => {
      const student = await cache.getStudent();
      if (!student || !student.currentWeek) return;

      update({
        requestType: RequestType.forceCache,
        data: student.currentWeek,
      });
    },
    after: (result) => {
      const selectedWeek = result.data.weekInfo.selected;

      if (!data) {
        dispatch(setCurrentWeek(selectedWeek));
        cache.placePartialStudent({ currentWeek: selectedWeek });
      }

      if (!fetchedWeeks.current.includes(selectedWeek)) {
        fetchedWeeks.current.push(selectedWeek);
      }
    },
  });
  const innerUpdate = (week: number) => {
    update({
      requestType:
        (data && week < currentWeek) || fetchedWeeks.current.includes(week)
          ? RequestType.tryCache
          : RequestType.tryFetch,
      data: week,
    });
  };

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
      <PageNavigator
        firstPage={data.weekInfo.first}
        lastPage={data.weekInfo.last}
        currentPage={data.weekInfo.selected}
        onPageChange={innerUpdate}
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

      <View style={{ marginTop: '2%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[fontSize.medium, globalStyles.textColor, { fontWeight: '500' }]}>
          {data.weekInfo.dates.start} - {data.weekInfo.dates.end}
        </Text>
      </View>

      {data.weekInfo.type === WeekTypes.holiday ? (
        <HolidayView holidayInfo={data.weekInfo.holidayDates} />
      ) : (
        <DayArray data={data.days} />
      )}
    </Screen>
  );
};

export default TimeTable;
