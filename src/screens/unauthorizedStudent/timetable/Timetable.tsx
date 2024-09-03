import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { getPeriodWeek } from '~/api/psutech/api';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import { useClient } from '~/data/client';
import { useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimetable from '~/hooks/useTimetable';
import { RequestType } from '~/models/results';
import { UnauthorizedTeacherStackScreenProps } from '~/navigation/types';
import {
  getCurrentEducationYear,
  getFirstEducationWeekDate,
  getLastEducationWeekDate,
  getStudentYear,
} from '~/utils/datetime';

const Timetable = ({ navigation }: UnauthorizedTeacherStackScreenProps) => {
  const { group } = useAppSelector((state) => state.account.student);
  const client = useClient();

  const { data: periodWeek } = useTanstackQuery({
    queryFn: () => getPeriodWeek(group.period_type, getCurrentEducationYear()),
    queryKey: ['periods'],
  });

  const { data, isLoading, refresh, update, initialPayload } = useQuery({
    method: client.getGroupTimetable,
    payload: {
      data: {
        facultyId: group.faculty.id,
        groupId: group.id,
        course: getStudentYear(group.year),
        year: getCurrentEducationYear(),
        // Будет заполнено позже
        period: 0,
        week: 0,
      },
      requestType: RequestType.tryFetch,
    },
    skipInitialGet: true,
    after: (result) => {
      timetable.updateData(result.data.weekInfo);
    },
  });

  const loadData = (week: number) => {
    let periodNumber: number;
    periodWeek.periods_to_weeks.forEach(([start, end], index) => {
      if (start <= week && end >= week) {
        periodNumber = index + 1;
      }
    });

    const payload = {
      data: {
        ...initialPayload,
        period: periodNumber,
        week,
      },
      requestType: RequestType.tryFetch,
    };
    update(payload);
  };

  useEffect(() => {
    if (periodWeek) {
      loadData(timetable.currentWeek);
    }
  }, [periodWeek]);

  const timetable = useTimetable({
    onRequestUpdate: loadData,
  });

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => <></> });
  }, []);

  return (
    <Screen onUpdate={refresh}>
      <TimetableContainer
        data={data}
        timetable={timetable}
        isLoading={isLoading}
        loadingComponent={() => <LoadingContainer />}
        startDate={getFirstEducationWeekDate()}
        endDate={getLastEducationWeekDate()}
        firstWeek={1}
        lastWeek={53}
      />
    </Screen>
  );
};

export default Timetable;
