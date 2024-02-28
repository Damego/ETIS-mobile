import { useNavigation } from '@react-navigation/native';
import moment from 'moment/moment';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '../../components/Text';
import { useAppSelector } from '../../hooks';
import { TeacherType } from '../../models/teachers';
import { ILesson, IPair } from '../../models/timeTable';
import { BottomTabsNavigationProp } from '../../navigation/types';
import { getTeacherName } from '../../utils/teachers';
import { fontSize, formatAudience } from '../../utils/texts';

export default function Pair({
  pair,
  teachersData,
  date,
}: {
  pair: IPair;
  teachersData: TeacherType;
  date: moment.Moment;
}) {
  const { isLyceum } = useAppSelector((state) => state.student.info);
  const pairText = `${pair.position} ${isLyceum ? 'урок' : 'пара'}`;

  return (
    <View style={styles.pairContainer}>
      <View style={styles.pairTimeContainer}>
        <Text style={fontSize.mini} colorVariant={'block'}>
          {pairText}
        </Text>
        <Text colorVariant={'block'}>{pair.time}</Text>
      </View>

      <View style={{ flexDirection: 'column', flex: 1 }}>
        {pair.lessons.map((lesson, ind) => {
          const time = moment(pair.time, 'HH:mm');

          return (
            <Lesson
              key={lesson.subject.string + ind}
              data={lesson}
              teachersData={teachersData}
              date={date.clone().set({ hour: time.hour(), minute: time.minutes() })}
              pairPosition={pair.position}
            />
          );
        })}
      </View>
    </View>
  );
}

const Lesson = ({
  data,
  teachersData,
  date,
  pairPosition,
}: {
  data: ILesson;
  teachersData: TeacherType;
  date: moment.Moment;
  pairPosition: number;
}) => {
  const navigation = useNavigation<BottomTabsNavigationProp>();

  const audience = formatAudience(data);
  const teacherName = getTeacherName(teachersData, data.teacher);

  return (
    <TouchableOpacity
      style={styles.lessonContainer}
      onPress={() =>
        navigation.navigate('DisciplineInfo', {
          lesson: data,
          date: date.toISOString(),
          pairPosition,
        })
      }
    >
      <Text style={[fontSize.medium, styles.lessonInfoText]} colorVariant={'block'}>
        {data.subject.string}
      </Text>

      {data.distancePlatform && <Text>{data.distancePlatform.name}</Text>}
      {!data.distancePlatform && audience && <Text colorVariant={'block'}>{audience}</Text>}
      {data.announceHTML && <Text colorVariant={'block'}>Объявление</Text>}

      {teacherName && <Text colorVariant={'block'}>{teacherName}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pairContainer: {
    flexDirection: 'row',
    marginBottom: '1%',
  },
  pairTimeContainer: {
    marginVertical: 2,
    marginRight: '2%',
    alignItems: 'center',
  },
  lessonContainer: {},
  lessonInfoText: {
    fontWeight: '500',
  },
});
