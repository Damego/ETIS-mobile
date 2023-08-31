import React from 'react';
import { Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { WeekDates } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';

const HolidayView = ({ holidayInfo }: { holidayInfo: WeekDates }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text style={[fontSize.xlarge, globalStyles.textColor, { fontWeight: '600' }]}>
        Каникулы!
      </Text>
      <Text style={[fontSize.large, globalStyles.textColor, { fontWeight: '500' }]}>
        С {holidayInfo.start} по {holidayInfo.end}
      </Text>
    </View>
  );
};

export default HolidayView;
