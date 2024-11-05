import dayjs from 'dayjs';
import React from 'react';
import { Text, View } from 'react-native';
import { useGlobalStyles } from '~/hooks';
import { WeekDates } from '~/models/timeTable';
import { parseDate } from '~/parser/utils';
import { fontSize } from '~/utils/texts';

const DatesContainer = ({ dates }: { dates: WeekDates }) => {
  const globalStyles = useGlobalStyles();
  if (!dates) return;

  const startDate = parseDate(dates.start).format('D MMMM');
  const endDate = parseDate(dates.end).format('D MMMM');

  return (
    <View style={{ marginVertical: '2%', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[fontSize.medium, globalStyles.textColor, { fontWeight: '500' }]}>
        {startDate} - {endDate}
      </Text>
    </View>
  );
};

export default DatesContainer;
