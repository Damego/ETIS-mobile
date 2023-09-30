import moment from 'moment/moment';
import React from 'react';
import { Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { WeekDates } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';

const DatesContainer = ({ dates }: { dates: WeekDates }) => {
  const globalStyles = useGlobalStyles();
  if (!dates) return;

  const startDate = moment(dates.start, 'DD.MM.YYYY').format('D MMMM');
  const endDate = moment(dates.end, 'DD.MM.YYYY').format('D MMMM');

  return (
    <View style={{ marginTop: '2%', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[fontSize.medium, globalStyles.textColor, { fontWeight: '500' }]}>
        {startDate} - {endDate}
      </Text>
    </View>
  );
};

export default DatesContainer;
