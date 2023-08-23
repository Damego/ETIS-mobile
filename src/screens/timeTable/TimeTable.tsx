import React, { useEffect, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { GetResultType, RequestType } from '../../models/results';
import { ITimeTableGetProps, WeekTypes } from '../../models/timeTable';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { setCurrentWeek, setData } from '../../redux/reducers/timeTableSlice';
import { fontSize } from '../../utils/texts';
import DayArray from './DayArray';
import HolidayView from './HolidayView';

const TimeTableData = ({ data }) => {
  const globalStyles = useGlobalStyles();

  return (
    <>
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
    </>
  );
};

const TimeTable = () => {
  const globalStyles = useGlobalStyles();
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const client = getWrappedClient();

  const { data, currentWeek } = useAppSelector((state) => state.timeTable);
  const [isLoading, setLoading] = useState<boolean>(false);

  const loadData = async ({ week, force }: { week?: number; force?: boolean }) => {
    setLoading(true);

    const useCached = ((data && week < currentWeek) || cache.hasTimeTableWeek(week)) && !force;

    const payload: ITimeTableGetProps = {
      week: week,
      requestType: useCached ? RequestType.tryCache : RequestType.tryFetch, // Если не получится получить данные, будем использовать кэшированные данные
    };
    const result = await client.getTimeTableData(payload);

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      if (!data) setLoading(false);
      ToastAndroid.show('Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    // Очевидно, что это будет текущей неделей
    if (!data) dispatch(setCurrentWeek(result.data.weekInfo.selected));

    dispatch(setData(result.data));
    setLoading(false);
  };

  const refresh = () => loadData({ week: data && data.weekInfo.selected, force: true });

  useEffect(() => {
    if (!isAuthorizing) loadData({});
  }, [isAuthorizing]);

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
      <PageNavigator
        firstPage={data.weekInfo.first}
        lastPage={data.weekInfo.last}
        currentPage={data.weekInfo.selected}
        onPageChange={(week) => loadData({ week })}
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

      {data ? <TimeTableData data={data} /> : <NoData onRefresh={refresh} />}
    </Screen>
  );
};

export default TimeTable;
