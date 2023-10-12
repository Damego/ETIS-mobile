import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import Card from '../../components/Card';
import CardHeaderOut from '../../components/CardHeaderOut';
import { ITeacher } from '../../models/teachers';
import { ServicesNavigationProp } from '../../navigation/types';
import Teacher from './Teacher';
import { useGlobalStyles } from '../../hooks';

interface TeacherCardProps {
  discipline: string;
  teachers: ITeacher[];
}

const TeacherCard = ({ discipline, teachers }: TeacherCardProps) => {
  const navigation = useNavigation<ServicesNavigationProp>();
  const globalStyles = useGlobalStyles();

  return (
    <CardHeaderOut topText={discipline}>
      {teachers.map((teacher, index) => (
        <View key={teacher.name}>
          <Teacher data={teacher} />
          {index !== teachers.length - 1 ? <BorderLine /> : ''}
        </View>
      ))}
      <BorderLine />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('CathedraTimetable', { cathedraId: teachers[0].cathedraId })
        }
      >
        <Card style={{ alignItems: 'center', marginTop: '2%' }}>
          <Text style={[globalStyles.textColor, { fontWeight: '500' }]}>Расписание кафедры</Text>
        </Card>
      </TouchableOpacity>
    </CardHeaderOut>
  );
};

export default TeacherCard;
