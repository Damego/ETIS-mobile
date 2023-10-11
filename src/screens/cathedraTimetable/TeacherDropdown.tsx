import React from 'react';
import { Text, View } from 'react-native';

import ButtonMenu from '../../components/ModalMenu';
import { useGlobalStyles } from '../../hooks';
import { ITeacherTimetable } from '../../models/cathedraTimetable';
import { fontSize } from '../../utils/texts';
import { generateOptionsFromTeachers } from './utils';

const TeacherDropdown = ({
  currentTeacherName,
  timetable,
  onSelect,
}: {
  currentTeacherName: string;
  timetable: ITeacherTimetable[];
  onSelect: (teacherName: string) => void;
}) => {
  const globalStyles = useGlobalStyles();

  if (timetable.length === 1)
    return (
      <View style={{ alignItems: 'center', marginBottom: '2%' }}>
        <Text style={[globalStyles.textColor, fontSize.large, { fontWeight: '500' }]}>
          {currentTeacherName}
        </Text>
      </View>
    );

  const options = generateOptionsFromTeachers(timetable, currentTeacherName);

  return <ButtonMenu options={options} onSelect={onSelect} />;
};

export default TeacherDropdown;
