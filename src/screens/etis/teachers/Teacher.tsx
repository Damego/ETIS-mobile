import React, { useRef } from 'react';
import {
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import BottomSheetModal from '~/components/BottomSheetModal';
import DisciplineType from '~/components/DisciplineType';
import Text from '~/components/Text';
import { ITeacher } from '~/models/teachers';
import { fontSize } from '~/utils/texts';

interface TeacherProps {
  discipline: string;
  data: ITeacher;
  onPress: (teacher: ITeacher) => void;
}

const Teacher = ({ discipline, data, onPress }: TeacherProps) => {
  const subject = data.subjects.find((sub) => sub.discipline === discipline);

  return (
    <TouchableOpacity onPress={() => onPress(data)} style={styles.container}>
      <View style={styles.teacherInfo}>
        <View style={styles.teacherNameView}>
          <Text style={styles.textTitle}>{data.name}</Text>
          <View style={styles.typesContainer}>
            {subject.types.map((type) => (
              <DisciplineType key={type} type={type} size={'small'} />
            ))}
          </View>
        </View>

        <Text style={fontSize.small}>{data.cathedra}</Text>
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
    </TouchableOpacity>
  );
};

export default Teacher;

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
  typesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
});
