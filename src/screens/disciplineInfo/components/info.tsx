import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cache } from '../../../cache/smartCache';
import { TeacherType } from '../../../models/teachers';
import { ITeacher } from '../../../models/timeTable';
import { getTeacherName } from '../../../utils/teachers';
import { fontSize } from '../../../utils/texts';

const IconInfo = ({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={30} style={styles.icon} />
    <Text style={styles.text}>{text}</Text>
  </View>
);

export const TimeInfo = ({ date, pairPosition }: { date: dayjs.Dayjs; pairPosition: number }) => {
  date = date.locale('ru');
  const day = date.format('D MMMM');
  const startTime = date.format('HH:mm');
  const endTime = date.clone().add(90, 'minute').format('HH:mm');

  const text = `${day}\n${startTime} – ${endTime} · ${pairPosition}-я пара`;

  return <IconInfo icon={'time-outline'} text={text} />;
};

export const TeacherInfo = ({ teacher }: { teacher?: ITeacher }) => {
  const [teachers, setTeachers] = useState<TeacherType>();

  useEffect(() => {
    cache.getTeachers().then((teachers) => {
      setTeachers(teachers);
    });
  }, []);

  if (!teacher || !teachers) return;

  const teacherName = getTeacherName(teachers, teacher);
  return <IconInfo icon={'school-outline'} text={teacherName} />;
};

export const AudienceInfo = ({ audienceText }: { audienceText: string }) => {
  // todo: format aud
  return <IconInfo icon={'business-outline'} text={audienceText} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    alignSelf: 'center',
  },
  text: {
    flexShrink: 1,
    ...fontSize.large,
  },
});
