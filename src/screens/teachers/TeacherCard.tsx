import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import { Button } from '../../components/Button';
import CardHeaderOut from '../../components/CardHeaderOut';
import { ITeacher } from '../../models/teachers';
import { ServicesNavigationProp } from '../../navigation/types';
import { fontSize } from '../../utils/texts';
import Teacher from './Teacher';

interface TeacherCardProps {
  discipline: string;
  teachers: ITeacher[];
}

const TeacherCard = ({ discipline, teachers }: TeacherCardProps) => {
  const navigation = useNavigation<ServicesNavigationProp>();

  return (
    <CardHeaderOut topText={discipline}>
      {teachers.map((teacher, index) => (
        <View key={teacher.name}>
          <Teacher discipline={discipline} data={teacher} />
          {index !== teachers.length - 1 ? <BorderLine /> : ''}
        </View>
      ))}
      <BorderLine />
      <Button
        text={'Расписание кафедры'}
        onPress={() =>
          navigation.navigate('CathedraTimetable', { cathedraId: teachers[0].cathedraId })
        }
        variant={'card'}
        fontStyle={fontSize.medium}
      />
    </CardHeaderOut>
  );
};

export default TeacherCard;
