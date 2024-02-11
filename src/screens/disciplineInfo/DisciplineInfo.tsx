import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import BorderLine from '../../components/BorderLine';
import Screen from '../../components/Screen';
import { TeacherType } from '../../models/teachers';
import { ITeacher } from '../../models/timeTable';
import { RootStackScreenProps } from '../../navigation/types';
import { disciplineRegex } from '../../parser/regex';
import { getTeacherName } from '../../utils/teachers';
import { getDisciplineTypeName } from '../../utils/texts';
import { Note } from './components/Note';
import { TaskContainer } from './components/TaskContainer';

const TypeContainer = ({ name, type }: { name: string; type: string }) => {
  const styles = useMemo(
    () =>
      StyleSheet.compose(typeContainerStyles.base, typeContainerStyles[typeNameToStyleName(type)]),
    [type]
  );

  return (
    <View style={styles}>
      <Text style={typeContainerStyles.text}>{name}</Text>
    </View>
  );
};

const IconInfo = ({ icon, text }: { icon: string; text: string }) => (
  <View style={{ flexDirection: 'row', gap: 8 }}>
    <Ionicons name={icon} size={30} style={{ alignSelf: 'center' }} />
    <Text style={{ fontSize: 20 }}>{text}</Text>
  </View>
);

const TimeInfo = ({ date, pairPosition }: { date: dayjs.Dayjs; pairPosition: number }) => {
  date = date.locale('ru');
  const day = date.format('D MMMM');
  const startTime = date.format('HH:mm');
  const endTime = date.clone().add(90, 'minute').format('HH:mm');

  const text = `${day}\n${startTime} – ${endTime} · ${pairPosition}-я пара`;

  return <IconInfo icon={'time-outline'} text={text} />;
};

const TeacherInfo = ({ teacher }: { teacher?: ITeacher }) => {
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

const AudienceInfo = ({ audienceText }: { audienceText: string }) => {
  // todo: format aud
  return <IconInfo icon={'business-outline'} text={audienceText} />;
};

const DisciplineInfo = ({ route }: RootStackScreenProps<'DisciplineInfo'>) => {
  const { date: stringDate, lesson, pairPosition } = route.params;

  // React navigation не позволяет передавать функции и экземпляры классов,
  // поэтому пришлось преобразовать Moment в строку, а сейчас обратно
  const date = useMemo(() => dayjs(stringDate), [stringDate]);

  // TODO: move type parse in parser
  const [disciplineName, disciplineType, typeName] = useMemo(() => {
    const [, discipline, type] = disciplineRegex.exec(lesson.subject);
    return [discipline, type, getDisciplineTypeName(type)];
  }, [lesson]);

  // todo: добавить ссылку на дистант и на всякие объявления

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFF',
          borderRadius: 20,
          gap: 8,
          padding: '2%',
          marginBottom: '2%',
        }}
      >
        <Text style={{ fontWeight: '500', fontSize: 20 }}>{disciplineName}</Text>
        <TypeContainer name={typeName} type={disciplineType} />

        <View />

        <TimeInfo date={date} pairPosition={pairPosition} />
        <AudienceInfo audienceText={lesson.audienceText} />
        <TeacherInfo teacher={lesson.teacher} />

        <Note disciplineName={disciplineName} />
        <BorderLine />
        <TaskContainer disciplineName={disciplineName} disciplineDate={date} />
      </View>
    </Screen>
  );
};

const typeContainerStyles = StyleSheet.create({
  base: {
    borderRadius: 5,
    paddingHorizontal: '2%',
    paddingVertical: '1%',
    alignSelf: 'flex-start',
  },
  lecture: {
    backgroundColor: '#C62E3E',
  },
  practice: {
    backgroundColor: '#0053cd',
  },
  laboratory: {
    backgroundColor: '#4CAF50',
  },
  unknown: {
    backgroundColor: '#B0BEC5',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

const typeNameToStyleName = (typeName: string) =>
  ({
    // todo: чтоб без повторений типов было. Привести все к единому стилю
    лек: 'lecture',
    практ: 'practice',
    лаб: 'laboratory',
  })[typeName] || 'unknown';

export default DisciplineInfo;
