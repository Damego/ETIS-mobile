import { Text, View } from 'react-native';
import { fontSize } from '../../utils/texts';
import React from 'react';
import { useGlobalStyles } from '../../hooks';

const HolidayView = () => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text style={[fontSize.xlarge, globalStyles.textColor, { fontWeight: '600' }]}>
        Каникулы!
      </Text>
    </View>
  );
};

export default HolidayView;
