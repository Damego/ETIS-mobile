import dayjs from 'dayjs';
import React from 'react';
import { Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { WeekDates } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';

const DatesContainer = ({ dates }: { dates: WeekDates }) => {
  const globalStyles = useGlobalStyles();
  if (!dates) return;

  const startDate = dayjs(dates.start, 'DD.MM.YYYY').format('D MMMM');
  const endDate = dayjs(dates.end, 'DD.MM.YYYY').format('D MMMM');

  return (
    <View style={{ marginVertical: '2%', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[fontSize.medium, globalStyles.textColor, { fontWeight: '500' }]}>
        {startDate} - {endDate}
      </Text>
    </View>
  );
};

export default DatesContainer;
