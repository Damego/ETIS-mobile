import React from 'react';
import { Text, View } from 'react-native';

import LoadingScreen, { LoadingContainer } from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { useGlobalStyles } from '../../hooks';
import useTimeTableQuery from '../../hooks/useTimeTableQuery';
import { WeekTypes } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';
import DayArray from './DayArray';
import HolidayView from './HolidayView';

const TimeTable = () => {
  const globalStyles = useGlobalStyles();
  const { data, isLoading, refresh, loadWeek, currentWeek } = useTimeTableQuery();

  if (isLoading && !data) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

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

      {isLoading ? (
        <LoadingContainer />
      ) : (
        <>
          {data.weekInfo.dates && (
            <View style={{ marginTop: '2%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[fontSize.medium, globalStyles.textColor, { fontWeight: '500' }]}>
                {data.weekInfo.dates.start} - {data.weekInfo.dates.end}
              </Text>
            </View>
          )}

          {data.weekInfo.type === WeekTypes.holiday ? (
            <HolidayView holidayInfo={data.weekInfo.holidayDates} />
          ) : (
            <DayArray data={data.days} />
          )}
        </>
      )}
    </Screen>
  );
};

export default TimeTable;
