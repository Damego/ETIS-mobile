import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import Screen from '~/components/Screen';
import Text from '~/components/Text';
import BellScheduleButton from '~/components/timetable/buttons/BellScheduleButton';
import DisciplineTasksButton from '~/components/timetable/buttons/DisciplineTasksButton';
import ToggleModeButton from '~/components/timetable/buttons/ToggleModeButton';
import { useAppSelector } from '~/hooks';
import ICalTimetable from '~/screens/etis/main/timetable/ICalTimetable';
import EducationTimetable from '~/screens/etis/main/timetable/EducationTimetable';

export const Timetable = () => {
  const iCalToken = useAppSelector((state) => state.student.iCalToken);
  const ref = useRef();

  return (
    <Screen onUpdate={() => ref.current.refresh()} containerStyle={{ paddingBottom: '20%' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Расписание</Text>
        <View style={styles.titleIconsContainer}>
          <ToggleModeButton />
          <BellScheduleButton />
          <DisciplineTasksButton />
        </View>
      </View>

      {iCalToken ? <ICalTimetable ref={ref} /> : <EducationTimetable ref={ref} />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontWeight: '700',
    fontSize: 22,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
});
