import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import DisciplineType from '../../components/DisciplineType';
import Text from '../../components/Text';
import TimeTableContext from '../../context/timetableContext';
import { useAppSelector } from '../../hooks';
import { ILesson, IPair } from '../../models/timeTable';
import { BottomTabsNavigationProp } from '../../navigation/types';
import { getTeacherName } from '../../utils/teachers';

export default function Pair({ pair, date }: { pair: IPair; date: dayjs.Dayjs }) {
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
          const time = dayjs(pair.time, 'HH:mm');
          const cloned = date.clone().set('hour', time.hour()).set('minute', time.minute());

          return (
            <Lesson
              key={lesson.subject.string + ind}
              data={lesson}
              date={cloned}
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
  date,
  pairPosition,
}: {
  data: ILesson;
  date: dayjs.Dayjs;
  pairPosition: number;
}) => {
  const navigation = useNavigation<BottomTabsNavigationProp>();
  const { teachers } = useContext(TimeTableContext);

  const audience = formatAudience(data);
  const teacherName = getTeacherName(teachers, data.teacher);

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
        {data.subject.discipline ?? data.subject.string}
      </Text>
      {data.subject.type && <DisciplineType type={data.subject.type} size={'small'} />}

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
