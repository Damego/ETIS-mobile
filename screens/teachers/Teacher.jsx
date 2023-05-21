import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

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

const Teacher = ({ data: { cathedra, name, photo, photoTitle, subjectType } }) => (
  <View style={styles.container}>
    <View style={styles.teacherInfo}>
      <View style={styles.teacherNameView}>
        <Text style={[styles.fontS16, styles.fontW500]}>{name}</Text>
        <Text style={styles.fontS16}>{subjectType}</Text>
      </View>

      <View style={styles.subjectInfoView}>
        <Text style={styles.subjectInfoText}>{cathedra}</Text>
      </View>
    </View>

    <View style={styles.photoContainer}>
      {/* Фотография загружена... */}
      <TouchableWithoutFeedback onPress={() => ToastAndroid.show(photoTitle, ToastAndroid.SHORT)}>
        <Image style={styles.photoStyle} src={`https://student.psu.ru/pls/stu_cus_et/${photo}`} />
      </TouchableWithoutFeedback>
    </View>
  </View>
);

export default Teacher;
