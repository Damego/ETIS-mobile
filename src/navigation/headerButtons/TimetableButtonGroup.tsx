import React from 'react';
import { StyleSheet, View } from 'react-native';

import BellScheduleButton from '../../screens/etis/main/timetable/BellScheduleButton';
import DisciplineTasksButton from '../../screens/etis/main/timetable/DisciplineTasksButton';

const TimetableButtonGroup = () => {
  return (
    <View style={styles.view}>
      <BellScheduleButton />
      <DisciplineTasksButton />
    </View>
  );
};

export default TimetableButtonGroup;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    gap: 12,
    marginRight: '9%',
  },
});
