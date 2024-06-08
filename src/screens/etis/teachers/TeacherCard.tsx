import React from 'react';
import { View } from 'react-native';

import BorderLine from '~/components/BorderLine';
import CardHeaderOut from '~/components/CardHeaderOut';
import { ITeacher } from '~/models/teachers';
import Teacher from './Teacher';

interface TeacherCardProps {
  discipline: string;
  teachers: ITeacher[];
}

const TeacherCard = ({ discipline, teachers }: TeacherCardProps) => (
  <CardHeaderOut topText={discipline}>
    {teachers.map((teacher, index) => (
      <View key={teacher.name}>
        <Teacher discipline={discipline} data={teacher} />
        {index !== teachers.length - 1 ? <BorderLine /> : ''}
      </View>
    ))}
  </CardHeaderOut>
);

export default TeacherCard;
