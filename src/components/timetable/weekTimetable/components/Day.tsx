import dayjs from 'dayjs';
import React, { useContext, useMemo } from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import CardHeaderOut from '~/components/CardHeaderOut';
import Text from '~/components/Text';
import Pair from '~/components/timetable/dayTimetable/components/Pair';
import TimeTableContext from '~/context/timetableContext';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { ITimeTableDay } from '~/models/timeTable';
import { parseDate } from '~/parser/utils';
import { ThemeType } from '~/styles/themes';
import { capitalizeWord, fontSize } from '~/utils/texts';
import { getRandomItem } from '~/utils/utils';

interface DayData {
  data: ITimeTableDay;
  date: dayjs.Dayjs;
}

const responses = ['Пар нет', 'Отдых', '💤', '😴', '🎮', '(๑ᵕ⌓ᵕ̤)'];

const getRandomResponse = (appTheme: ThemeType) => {
  // if (appTheme === ThemeType.halloween) return getRandomItem(halloweenEmptyDayResponses);
  // if (isNewYearTheme(appTheme)) return getRandomItem(newYearEmptyDayResponse);
  return getRandomItem(responses);
};

export const Day = React.memo(({ data, date }: DayData) => {
  const { pairs } = data;
  const {
    theme,
    ui: { highlightCurrentDay },
  } = useAppSelector((state) => state.settings.config);
  const globalStyles = useGlobalStyles();
  const { currentDate } = useContext(TimeTableContext);

  let textStyle = null;
  let cardStyle = null;
  if (highlightCurrentDay && currentDate.diff(date, 'day') === 0) {
    textStyle = globalStyles.primaryText;
    cardStyle = { borderColor: globalStyles.primaryText.color };
  }

  return (
    <View style={[cardStyle, { gap: 10 }]}>
      <Text style={[fontSize.medium, { fontWeight: 'bold' }, textStyle]}>
        {capitalizeWord(date.format('dddd, DD MMMM'))}
      </Text>
      {data.pairs.length === 0 ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...fontSize.medium, fontWeight: '600' }}>{getRandomResponse(theme)}</Text>
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          {pairs.map(
            (pair, index) =>
              (!!pair.lessons.length || !!pair.event) && <Pair pair={pair} key={index} />
          )}
        </View>
      )}
    </View>
  );
});
