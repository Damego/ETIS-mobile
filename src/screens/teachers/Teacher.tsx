import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, ToastAndroid, TouchableWithoutFeedback, View } from 'react-native';

import ClickableText from '../../components/ClickableText';
import DisciplineType from '../../components/DisciplineType';
import Text from '../../components/Text';
import { ITeacher } from '../../models/teachers';
import { ServicesNavigationProp } from '../../navigation/types';
import { fontSize, getDisciplineTypeName } from '../../utils/texts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  teacherNameView: {},
  textTitle: {
    fontWeight: '500',
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
});

interface TeacherProps {
  data: ITeacher;
}

const Teacher = ({ data }: TeacherProps) => {
  const navigation = useNavigation<ServicesNavigationProp>();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.teacherInfo}>
          <View style={styles.teacherNameView}>
            <Text style={[fontSize.medium, styles.textTitle]} colorVariant={'block'}>
              {data.name}
            </Text>
            <View style={{flexDirection: 'row', gap: 4}}>
              {<Text>{data.subject.types.join(', ')}</Text>}
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
