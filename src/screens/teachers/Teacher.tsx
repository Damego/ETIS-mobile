import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ContextMenu from 'react-native-context-menu-view';

import DisciplineType from '../../components/DisciplineType';
import Text from '../../components/Text';
import { ITeacher } from '../../models/teachers';
import { ServicesNavigationProp } from '../../navigation/types';
import { httpClient } from '../../utils';
import { fontSize } from '../../utils/texts';

interface TeacherProps {
  discipline: string;
  data: ITeacher;
}

const getSearchTeacherName = (teacher: string) => {
  const names = teacher.split(' ');

  // Возможны проблемы в поиске иностранных учителей (Китай)
  if (names.length !== 3) return teacher;

  const [first, middle, last] = names;
  return `${middle} ${last} ${first.toUpperCase()}`;
};

const Teacher = ({ discipline, data }: TeacherProps) => {
  const navigation = useNavigation<ServicesNavigationProp>();
  const subject = data.subjects.find((sub) => sub.discipline === discipline);

  return (
    <View style={styles.container}>
      <View style={styles.teacherInfo}>
        <View style={styles.teacherNameView}>
          <ContextMenu
            actions={[
              { title: 'Скопировать' },
              { title: 'Найти на сайте ПГНИУ' },
              { title: 'Расписание пар' },
            ]}
            onPress={(event) => {
              const pressIndex = event.nativeEvent.index;

              if (pressIndex === 0) {
                Clipboard.setStringAsync(data.name);
                ToastAndroid.show('Скопировано в буфер обмена', ToastAndroid.LONG);
              } else if (pressIndex === 1) {
                Linking.openURL(httpClient.getSearchPageURL(getSearchTeacherName(data.name)));
              } else if (pressIndex === 2) {
                navigation.navigate('CathedraTimetable', { teacherId: data.id });
              }
            }}
            dropdownMenuMode
          >
            {/* fake touchable effect */}
            <TouchableOpacity>
              <Text style={styles.textTitle} colorVariant={'block'}>
                {data.name}
              </Text>
            </TouchableOpacity>
          </ContextMenu>
          <View style={styles.typesContainer}>
            {subject.types.map((type) => (
              <DisciplineType key={type} type={type} size={'small'} />
            ))}
          </View>
        </View>

        <ContextMenu
          actions={[{ title: 'Скопировать' }, { title: 'Расписание пар' }]}
          onPress={(event) => {
            const pressIndex = event.nativeEvent.index;

            if (pressIndex === 0) {
              Clipboard.setStringAsync(data.name);
              ToastAndroid.show('Скопировано в буфер обмена', ToastAndroid.LONG);
            } else if (pressIndex === 1) {
              navigation.navigate('CathedraTimetable', { cathedraId: data.cathedraId });
            }
          }}
          dropdownMenuMode
        >
          {/* fake touchable effect */}
          <TouchableOpacity style={styles.subjectInfoView}>
            <Text style={fontSize.small} colorVariant={'block'}>
              {data.cathedra}
            </Text>
          </TouchableOpacity>
        </ContextMenu>
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
