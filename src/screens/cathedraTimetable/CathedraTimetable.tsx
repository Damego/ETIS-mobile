import React, { useState } from 'react';
import { View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import CenteredText from '../../components/CenteredText';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import useQuery from '../../hooks/useQuery';
import { TimetableTypes } from '../../models/cathedraTimetable';
import { RequestType } from '../../models/results';
import { ServiceNativeStackScreenProps } from '../../navigation/types';
import Navigation, { NavigationTypeDropdown } from './Navigation';
import Pairs from './Pairs';
import TeacherMenu from './TeacherMenu';
import { DAYS } from './utils';

const CathedraTimetable = ({ route }: ServiceNativeStackScreenProps<'CathedraTimetable'>) => {
  const client = useClient();
  const { data, isLoading, refresh, update, initialPayload } = useQuery({
    method: client.getCathedraTimetable,
    payload: {
      data: {
        cathedraId: route.params.cathedraId,
        teacherId: route.params.teacherId,
      },
      requestType: RequestType.forceFetch,
    },
  });
  const [type, setType] = useState<TimetableTypes>(TimetableTypes.sessions);
  const [currentTeacher, setCurrentTeacher] = useState<string>();

  const onChange = (data: number) => {
    update({
      data: {
        ...initialPayload,
        week: type === TimetableTypes.weeks ? data : undefined,
        session: type === TimetableTypes.sessions ? data : undefined,
      },
      requestType: RequestType.forceFetch,
    });
  };

  const onTeacherSelect = (teacher: string) => {
    setCurrentTeacher(teacher);
  };

  if (isLoading && !data) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData />;

  const teacherTimetable =
    data.timetable.find((timetable) => timetable.teacherName === currentTeacher) ||
    data.timetable[0];

  return (
    <Screen onUpdate={refresh}>
      <View
        style={{
          flexDirection: type === TimetableTypes.sessions ? 'row' : 'column',
          marginBottom: '2%',
        }}
      >
        <NavigationTypeDropdown type={type} onSelect={setType} />
        <Navigation data={data} onChange={onChange} type={type} />
      </View>

      <TeacherMenu
        currentTeacherName={teacherTimetable.teacherName}
        timetable={data.timetable}
        onSelect={onTeacherSelect}
      />

      {!teacherTimetable.days.length && <CenteredText>Пар нет</CenteredText>}

      {teacherTimetable.days.map((day, index) => (
        <CardHeaderOut topText={DAYS[index]} key={index}>
          <Pairs pairs={day.pairs} />
        </CardHeaderOut>
      ))}
    </Screen>
  );
};

export default CathedraTimetable;
