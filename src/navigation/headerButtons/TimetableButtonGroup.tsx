import React from 'react';
import { StyleSheet, View } from 'react-native';

import BellScheduleButton from '~/components/timetable/buttons/BellScheduleButton';
import DisciplineTasksButton from '~/components/timetable/buttons/DisciplineTasksButton';

const TimetableButtonGroup = () => (
  <View style={styles.view}>
    <BellScheduleButton />
    <DisciplineTasksButton />
  </View>
);

export default TimetableButtonGroup;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    gap: 12,
    marginRight: '9%',
  },
});
