import React from 'react';
import { View } from 'react-native';
import ButtonMenu from '~/components/ButtonMenu';
import Text from '~/components/Text';
import { ITeacher, ITimeTable } from '~/models/timeTable';
import { fontSize } from '~/utils/texts';

import { generateOptionsFromTeachers } from './utils';

const TeacherMenu = ({
  currentTeacher,
  timetable,
  onSelect,
}: {
  currentTeacher: ITeacher;
  timetable: ITimeTable[];
  onSelect: (teacher: ITeacher) => void;
}) => {
  if (timetable.length === 1)
    return (
      <View style={{ alignItems: 'center', marginBottom: '2%' }}>
        <Text style={[fontSize.large, { fontWeight: '500' }]}>{currentTeacher.name}</Text>
      </View>
    );

  const options = generateOptionsFromTeachers(timetable, currentTeacher.id);

  return <ButtonMenu options={options} onSelect={onSelect} />;
};

export default TeacherMenu;
