import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { ITeacher } from '../../models/teachers';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  teacherNameView: {},
  fontW500: {
    fontWeight: '500',
  },
  fontS16: {
    fontSize: 16,
  },
  subjectInfoView: {},
  subjectInfoText: {
    fontSize: 14,
  },
  photoContainer: {},
  photoStyle: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  teacherInfo: {
    flex: 2,
  },
});

interface TeacherProps {
  data: ITeacher;
}

const Teacher = ({ data }: TeacherProps) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={styles.container}>
      <View style={styles.teacherInfo}>
        <View style={styles.teacherNameView}>
          <Text style={[styles.fontS16, styles.fontW500, globalStyles.textColor]}>{data.name}</Text>
          <Text style={[styles.fontS16, globalStyles.textColor]}>{data.subjectType}</Text>
        </View>

        <View style={styles.subjectInfoView}>
          <Text style={[styles.subjectInfoText, globalStyles.textColor]}>{data.cathedra}</Text>
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
  );
};

export default Teacher;
