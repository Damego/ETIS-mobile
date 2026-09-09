import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Text from '~/components/Text';
import { checkAllowedPairRender } from '~/components/timetable/checkAllowedPairRender';
import Pair from '~/components/timetable/dayTimetable/components/Pair';
import { useTimetableContext } from '~/context/timetableContext';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { ITimeTableDay } from '~/models/timeTable';
import { getEmptyDayResponses } from '~/utils/events';
import { capitalizeWord, fontSize } from '~/utils/texts';
import { getRandomItem } from '~/utils/utils';

interface DayData {
  readonly data: ITimeTableDay;
  readonly date: dayjs.Dayjs;
}

export const Day = React.memo(({ data, date }: DayData) => {
  const { i18n } = useTranslation();
  const { pairs } = data;
  const {
    theme,
    ui: { highlightCurrentDay, showEmptyPairs, showGapsBetweenPairs },
  } = useAppSelector((state) => state.settings.config);
  const globalStyles = useGlobalStyles();
  const { currentDate } = useTimetableContext();
  // Ответ для пустого дня фиксирован на день, а не меняется при каждом ре-рендере
  const emptyDayResponse = React.useMemo(() => getRandomItem(getEmptyDayResponses(theme)), [theme, date]);
  let didRenderFirstPair = false;

  let textStyle = null;
  let cardStyle = null;
  if (highlightCurrentDay && currentDate.diff(date, 'day') === 0) {
    textStyle = globalStyles.primaryText;
    cardStyle = { borderColor: globalStyles.primaryText.color };
  }

  return (
    <View style={[cardStyle, { gap: 10 }]}>
      <Text style={[fontSize.medium, { fontWeight: 'bold' }, textStyle]}>
        {capitalizeWord(date.locale(i18n.language).format('dddd, DD MMMM'))}
      </Text>
      {data.pairs.length === 0
        ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ ...fontSize.medium, fontWeight: '600' }}>{emptyDayResponse}</Text>
          </View>
        )
        : (
          <View style={{ gap: 8 }}>
            {pairs.map((pair, index) => {
              if (
                checkAllowedPairRender(pair, didRenderFirstPair, showGapsBetweenPairs, showEmptyPairs)
              ) {
                didRenderFirstPair = true;
                return <Pair key={index} pair={pair} />;
              }
              return null;
            })}
          </View>
        )}
    </View>
  );
});
