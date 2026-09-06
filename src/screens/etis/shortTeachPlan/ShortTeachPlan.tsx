import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import { ISessionTeachPlan } from '~/models/teachPlan';

import CalendarSchedule from './CalendarSchedule';
import SessionCard from './SessionCard';

const PeriodButton = React.memo(
  ({
    period,
    currentSession,
    isOpened,
    onPress,
  }: {
    readonly period: ISessionTeachPlan;
    readonly currentSession: number;
    readonly isOpened: boolean;
    readonly onPress: (period: number) => void;
  }) => {
    const globalStyles = useGlobalStyles();

    const isCurrentPeriod = currentSession === period.period.number;

    return (
      <TouchableOpacity
        style={[
          globalStyles.card,
          {
            height: 100, width: 100, justifyContent: 'center', alignItems: 'center'
          },
          isCurrentPeriod && globalStyles.primaryBackgroundColor,
          isOpened && {
            borderWidth: 2,
            borderColor: globalStyles.primaryBackgroundColor.backgroundColor,
          },
        ]}
        onPress={() => onPress(period.period.number)}
      >
        <Text
          style={{ fontSize: 30, fontWeight: 'bold' }}
          colorVariant={isCurrentPeriod ? 'primaryContrast' : undefined}
        >
          {period.period.number}
        </Text>
        <Text colorVariant={isCurrentPeriod ? 'primaryContrast' : undefined}>
          {period.period.name}
        </Text>
      </TouchableOpacity>
    );
  }
);

const ShortTeachPlan = () => {
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getTeachPlanData,
  });
  const currentSession = useAppSelector((state) => state.student.currentSession);
  // null = все периоды закрыты (повторный тап по открытому периоду закрывает его)
  const [openedPeriod, setOpenedPeriod] = useState<number | null>(currentSession ?? null);

  const handlePeriodPress = (period: number) => {
    setOpenedPeriod(($period) => {
      if ($period === period) return null;
      return period;
    });
  };

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data || data.length === 0) return <NoData onRefresh={refresh} />;

  return (
    <Screen containerStyle={{ gap: 16 }} onUpdate={refresh}>
      <CalendarSchedule />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {data
          .filter((period) => period?.period?.number != null)
          .map((period, index) => (
            <PeriodButton
              key={index}
              period={period}
              currentSession={currentSession ?? 0}
              isOpened={period.period.number === openedPeriod}
              onPress={handlePeriodPress}
            />
          ))}
      </View>
      {openedPeriod && data[openedPeriod - 1] ? <SessionCard data={data[openedPeriod - 1]} /> : null}
    </Screen>
  );
};

export default ShortTeachPlan;
