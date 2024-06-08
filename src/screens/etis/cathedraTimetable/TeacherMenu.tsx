import React from 'react';
import { View } from 'react-native';

import ButtonMenu from '~/components/ButtonMenu';
import Text from '~/components/Text';
import { ITeacherTimetable } from '~/models/cathedraTimetable';
import { fontSize } from '~/utils/texts';
import { generateOptionsFromTeachers } from './utils';

const TeacherMenu = ({
  currentTeacherName,
  timetable,
  onSelect,
}: {
  currentTeacherName: string;
  timetable: ITeacherTimetable[];
  onSelect: (teacherName: string) => void;
}) => {
  if (timetable.length === 1)
    return (
      <View style={{ alignItems: 'center', marginBottom: '2%' }}>
        <Text style={[fontSize.large, { fontWeight: '500' }]}>{currentTeacherName}</Text>
      </View>
    );

  const options = generateOptionsFromTeachers(timetable, currentTeacherName);

  return <ButtonMenu options={options} onSelect={onSelect} />;
};

export default TeacherMenu;
