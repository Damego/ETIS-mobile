import React from 'react';
import { Text, View } from 'react-native';

import Dropdown from '../../components/Dropdown';
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

  return (
    <View
      style={{
        marginLeft: 0,
        marginRight: 'auto',
        zIndex: 1,
      }}
    >
      <Dropdown
        selectedOption={{
          label: currentTeacherName,
          value: currentTeacherName,
          current: false,
        }}
        options={generateOptionsFromTeachers(timetable, currentTeacherName)}
        onSelect={onSelect}
      />
    </View>
  );
};

export default TeacherDropdown;
