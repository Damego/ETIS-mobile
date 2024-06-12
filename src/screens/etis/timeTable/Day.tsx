import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import CardHeaderOut from '~/components/CardHeaderOut';
import Text from '~/components/Text';
import TimeTableContext from '~/context/timetableContext';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { ITimeTableDay } from '~/models/timeTable';
import { ThemeType, isNewYearTheme } from '~/styles/themes';
import { halloweenEmptyDayResponses, newYearEmptyDayResponse } from '~/utils/events';
import { fontSize } from '~/utils/texts';
import { getRandomItem } from '~/utils/utils';

import Pair from './Pair';

interface DayData {
  data: ITimeTableDay;
  date: dayjs.Dayjs;
}

const responses = ['Пар нет', 'Отдых', '💤', '😴', '🎮', '(๑ᵕ⌓ᵕ̤)'];

const getRandomResponse = (appTheme: ThemeType) => {
  if (appTheme === ThemeType.halloween) return getRandomItem(halloweenEmptyDayResponses);
  if (isNewYearTheme(appTheme)) return getRandomItem(newYearEmptyDayResponse);
  return getRandomItem(responses);
};

export const Day = ({ data, date }: DayData) => {
  const { date: dateString, pairs } = data;
  const {
    theme,
    ui: { highlightCurrentDay },
  } = useAppSelector((state) => state.settings.config);
  const globalStyles = useGlobalStyles();
  const { currentDate } = useContext(TimeTableContext);

  let textStyle = null;
  let cardStyle = null;
  if (highlightCurrentDay && currentDate.diff(date, 'day') === 0) {
    textStyle = globalStyles.primaryFontColor;
    cardStyle = { borderColor: globalStyles.primaryFontColor.color };
  }

  return (
    <CardHeaderOut topText={dateString} topTextStyle={textStyle} style={cardStyle}>
      {data.pairs.length === 0 ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...fontSize.medium, fontWeight: '600' }} colorVariant={'block'}>
            {getRandomResponse(theme)}
          </Text>
        </View>
      ) : (
        pairs.map((pair, index) => (
          <View key={index + pair.time}>
            <Pair pair={pair} date={date} />
            {index !== pairs.length - 1 && <BorderLine />}
          </View>
        ))
      )}
    </CardHeaderOut>
  );
};
