import React from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import CardHeaderOut from '~/components/CardHeaderOut';
import { ITeacher } from '~/models/teachers';

import Teacher from './Teacher';

interface TeacherCardProps {
  discipline: string;
  teachers: ITeacher[];
  onPress: (teacher: ITeacher) => void;
}

const TeacherCard = ({ discipline, teachers, onPress }: TeacherCardProps) => (
  <CardHeaderOut topText={discipline}>
    {teachers.map((teacher, index) => (
      <View key={teacher.name}>
        <Teacher discipline={discipline} data={teacher} onPress={onPress} />
        {index !== teachers.length - 1 ? <BorderLine /> : ''}
      </View>
    ))}
  </CardHeaderOut>
);

export default TeacherCard;
