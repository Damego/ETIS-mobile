import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, ToastAndroid, TouchableWithoutFeedback, View } from 'react-native';

import ClickableText from '../../components/ClickableText';
import DisciplineType from '../../components/DisciplineType';
import Text from '../../components/Text';
import { ITeacher } from '../../models/teachers';
import { ServicesNavigationProp } from '../../navigation/types';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  teacherNameView: {},
  textTitle: {
    fontWeight: '500',
    ...fontSize.medium,
  },
  subjectInfoView: {},
  photoContainer: {},
  photoStyle: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  teacherInfo: {
    flex: 2,
  },
  teacherTimetableButton: { fontWeight: '500', textDecorationLine: 'underline' },
  typesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
});

interface TeacherProps {
  discipline: string;
  data: ITeacher;
}

const Teacher = ({ discipline, data }: TeacherProps) => {
  const navigation = useNavigation<ServicesNavigationProp>();
  const subject = data.subjects.find((sub) => sub.discipline === discipline);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.teacherInfo}>
          <View style={styles.teacherNameView}>
            <Text style={styles.textTitle} colorVariant={'block'}>
              {data.name}
            </Text>
            <View style={styles.typesContainer}>
              {subject.types.map((type) => (
                <DisciplineType key={type} type={type} size={'small'} />
              ))}
            </View>
          </View>

          <View style={styles.subjectInfoView}>
            <Text style={fontSize.small} colorVariant={'block'}>
              {data.cathedra}
            </Text>
          </View>
        </View>

        {/* Фотография загружена... */}
        <TouchableWithoutFeedback
          style={styles.photoContainer}
          onPress={() => ToastAndroid.show(data.photoTitle, ToastAndroid.SHORT)}
        >
          <Image
            style={styles.photoStyle}
            source={{
              uri: `https://student.psu.ru/pls/stu_cus_et/${data.photo}`,
            }}
          />
        </TouchableWithoutFeedback>
      </View>

      <ClickableText
        text={'Расписание преподавателя'}
        onPress={() => navigation.navigate('CathedraTimetable', { teacherId: data.id })}
        textStyle={styles.teacherTimetableButton}
        colorVariant={'block'}
      />
    </>
  );
};

export default Teacher;
