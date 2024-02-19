import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '../../../components/Text';
import { useClient } from '../../../data/client';
import { useAppSelector } from '../../../hooks';
import { useAppTheme } from '../../../hooks/theme';
import useQuery from '../../../hooks/useQuery';
import { RequestType } from '../../../models/results';
import { ITeacher } from '../../../models/timeTable';
import { getTeacherName } from '../../../utils/teachers';
import { fontSize } from '../../../utils/texts';

const PAIR_LENGTH = 95;
const LESSON_LENGTH = 40;

const studentTimeInfo = {
  length: PAIR_LENGTH,
  name: 'пара',
  ending: 'я',
} as const;

const lyceumTimeInfo = {
  length: LESSON_LENGTH,
  name: 'урок',
  ending: 'й',
} as const;

const IconInfo = ({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={30} style={styles.icon} color={theme.colors.textForBlock} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export const TimeInfo = ({ date, pairPosition }: { date: dayjs.Dayjs; pairPosition: number }) => {
  const { isLyceum } = useAppSelector((state) => state.student.info);

  date = date.locale('ru');
  const day = date.format('D MMMM');
  const startTime = date.format('HH:mm');

  const { name, length, ending } = isLyceum ? lyceumTimeInfo : studentTimeInfo;

  const endTime = date.clone().add(length, 'minute').format('HH:mm');

  const text = `${day}\n${startTime} – ${endTime} · ${pairPosition}-${ending} ${name}`;

  return <IconInfo icon={'time-outline'} text={text} />;
};

export const TeacherInfo = ({ teacher }: { teacher?: ITeacher }) => {
  const client = useClient();
  const { data } = useQuery({
    method: client.getTeacherData,
    payload: {
      requestType: RequestType.tryCache,
    },
  });

  if (!teacher || !data) return;

  const teacherName = getTeacherName(data, teacher);
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
