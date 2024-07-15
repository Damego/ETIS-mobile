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
    period: ISessionTeachPlan;
    currentSession: number;
    isOpened: boolean;
    onPress: (period: number) => void;
  }) => {
    const globalStyles = useGlobalStyles();

    const isCurrentPeriod = currentSession === period.period.number;

    return (
      <TouchableOpacity
        onPress={() => onPress(period.period.number)}
        style={[
          globalStyles.card,
          { height: 100, width: 100, justifyContent: 'center', alignItems: 'center' },
          isCurrentPeriod && globalStyles.primaryBackgroundColor,
          isOpened && {
            borderWidth: 2,
            borderColor: globalStyles.primaryBackgroundColor.backgroundColor,
          },
        ]}
      >
        <Text
          style={{ fontSize: 30, fontWeight: 'bold' }}
          colorVariant={isCurrentPeriod && 'primaryContrast'}
        >
          {period.period.number}
        </Text>
        <Text colorVariant={isCurrentPeriod && 'primaryContrast'}>{period.period.name}</Text>
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
  const [openedPeriod, setOpenedPeriod] = useState<number | null>(null);

  const handlePeriodPress = (period: number) => {
    setOpenedPeriod(($period) => {
      if ($period === period) return null;
      return period;
    });
  };

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh} containerStyle={{ gap: 16 }}>
      <CalendarSchedule />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {data.map((period, index) => (
          <PeriodButton
            period={period}
            currentSession={currentSession}
            isOpened={period.period.number === openedPeriod}
            onPress={handlePeriodPress}
            key={index}
          />
        ))}
      </View>
      {openedPeriod && <SessionCard data={data[openedPeriod - 1]} />}
    </Screen>
  );
};

export default ShortTeachPlan;
