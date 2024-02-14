import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { useAppTheme } from '../../hooks/theme';
import { RootStackScreenProps } from '../../navigation/types';
import { disciplineRegex } from '../../parser/regex';
import { fontSize, getDisciplineTypeName } from '../../utils/texts';
import Note from './components/Note';
import { TaskContainer } from './components/TaskContainer';
import { AudienceInfo, TeacherInfo, TimeInfo } from './components/info';

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

const DisciplineInfo = ({ route }: RootStackScreenProps<'DisciplineInfo'>) => {
  const { date: stringDate, lesson, pairPosition } = route.params;
  const theme = useAppTheme();

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
      <View style={[styles.container, { backgroundColor: theme.colors.block }]}>
        <Text style={styles.text}>{disciplineName}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    gap: 8,
    padding: '2%',
    marginBottom: '2%',
  },
  text: {
    fontWeight: '500',
    ...fontSize.big,
  },
});

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
