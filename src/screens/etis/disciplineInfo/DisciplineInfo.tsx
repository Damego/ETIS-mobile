import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import BorderLine from '~/components/BorderLine';
import Card from '~/components/Card';
import DisciplineType from '~/components/DisciplineType';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import { EducationStackScreenProps } from '~/navigation/types';
import { fontSize } from '~/utils/texts';
import { getStyles } from '~/utils/webView';

import Note from './components/Note';
import { TaskContainer } from './components/TaskContainer';
import { AudienceInfo, GroupsInfo, TeacherInfo, TimeInfo } from './components/info';

const DisciplineInfo = ({ route }: EducationStackScreenProps<'DisciplineInfo'>) => {
  const theme = useAppTheme();
  const { date: stringDate, lesson, pairPosition } = route.params;

  // React navigation не позволяет передавать функции и экземпляры классов,
  // поэтому пришлось преобразовать dayjs в строку, а сейчас обратно
  const date = dayjs(stringDate);

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text style={styles.text}>{lesson.subject.discipline}</Text>
        {lesson.subject?.type && <DisciplineType type={lesson.subject.type} />}

        <View />

        {lesson.announceHTML && (
          <Card>
            <AutoHeightWebView
              source={{ html: lesson.announceHTML }}
              customStyle={getStyles(theme.colors.text, theme.colors.primary)}
            />
          </Card>
        )}

        <TimeInfo date={date} pairPosition={pairPosition} />
        {lesson.audience?.string && <AudienceInfo lesson={lesson} />}
        {lesson.teacher && <TeacherInfo teacher={lesson.teacher} />}
        {lesson.groups && <GroupsInfo groups={lesson.groups} />}

        <Note disciplineName={lesson.subject.discipline} />
        <BorderLine />
        <TaskContainer disciplineName={lesson.subject.discipline} disciplineDate={date} />
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
    ...fontSize.mlarge,
  },
});

export default DisciplineInfo;
