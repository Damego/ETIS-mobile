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
  teacherNameView: {
    marginLeft: '1%',
    marginBottom: '1%',
    paddingHorizontal: '1%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  teacherNameText: {
    marginTop: '1%',
    fontSize: 16,
    fontWeight: '400',
  },
  subjectInfoView: {
    marginLeft: '2%',
  },
  subjectInfoText: {
    fontSize: 13,
    color: '#1c1c1c',
  },
  photoContainer: {
    justifyContent: 'center',
    padding: '1%',
  },
  photoStyle: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  container: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  teacherInfo: {
    flex: 2,
  },
});

const Teacher = ({ data: { cathedra, name, photo, photoTitle, subjectType } }) => (
  <View style={styles.container}>
    <View style={styles.teacherInfo}>
      <View style={styles.teacherNameView}>
        <Text style={styles.teacherNameText}>{name}</Text>
      </View>

      <View style={styles.subjectInfoView}>
        <Text style={styles.subjectInfoText}>{cathedra}</Text>
        <Text style={styles.subjectInfoText}>{subjectType}</Text>
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