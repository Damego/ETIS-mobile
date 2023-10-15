import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { ITeacher, TeacherType } from '../../models/teachers';
import { ILesson, IPair } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';

export default function Pair({ pair, teachersData }: { pair: IPair; teachersData: TeacherType }) {
  const globalStyles = useGlobalStyles();
  const pairText = `${pair.position} пара`;

  return (
    <View style={styles.pairContainer}>
      <View style={styles.pairTimeContainer}>
        <Text style={[fontSize.mini, globalStyles.textColor]}>{pairText}</Text>
        <Text style={globalStyles.textColor}>{pair.time}</Text>
      </View>

      <View style={{ flexDirection: 'column', flex: 1 }}>
        {pair.lessons.map((lesson, ind) => (
          <Lesson data={lesson} key={lesson.subject + ind} teachersData={teachersData} />
        ))}
      </View>
    </View>
  );
}

const Lesson = ({ data, teachersData }: { data: ILesson; teachersData: TeacherType }) => {
  const globalStyles = useGlobalStyles();
  const location =
    data.audience && data.building && data.floor
      ? `ауд. ${data.audience} (${data.building} корпус, ${data.floor} этаж)`
      : data.audienceText;
  const audience = data.isDistance ? data.audience : location;

  let teacherName: string;
  teachersData.forEach(([, teachers]) => {
    const teacher = teachers.find((teacher) => teacher.id === data.teacherId);
    if (teacher) teacherName = teacher.name;
  });

  return (
    <View style={styles.lessonContainer}>
      <Text style={[fontSize.medium, styles.lessonInfoText, globalStyles.textColor]}>
        {data.subject}
      </Text>
      {data.distancePlatform ? (
        <ClickableText
          text={data.distancePlatform.name}
          onPress={() => {
            Linking.openURL(data.distancePlatform.url);
          }}
          textStyle={[
            globalStyles.textColor,
            { textDecorationLine: 'underline', fontWeight: '500' },
          ]}
        />
      ) : (
        <>
          <Text style={globalStyles.textColor}>{audience}</Text>
          {teacherName && <Text style={globalStyles.textColor}>{teacherName}</Text>}
        </>
      )}
    </View>
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
