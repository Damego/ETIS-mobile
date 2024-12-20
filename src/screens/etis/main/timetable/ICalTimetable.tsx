import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import React, { useImperativeHandle } from 'react';
import { getICalendarData } from '~/api/iCal/api';
import { LoadingContainer } from '~/components/LoadingScreen';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import { useAppSelector } from '~/hooks';
import useTimetable from '~/hooks/useTimetable';
import { ITimeTable } from '~/models/timeTable';

const ICalTimetable = React.forwardRef<{ refresh: () => void }>((props, ref) => {
  console.log('IN ICAL TT');
  const student = useAppSelector((state) => state.student);
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);
  const [weekTimetable, setWeekTimetable] = React.useState<ITimeTable>();

  const getInnerData = async () => {
    const $allData = await getICalendarData(student.iCalToken, student.info?.isLyceum);
    const $timetable = $allData.find((tt) => tt.weekInfo.selected === timetable.selectedWeek);
    timetable.updateData($timetable.weekInfo);
    setWeekTimetable($timetable);
    return $allData;
  };

  const {
    data: allData,
    isLoading,
    refetch,
  } = useTanstackQuery({
    queryFn: getInnerData,
    queryKey: ['ical', student.iCalToken],
    retry: false,
    throwOnError: true,
  });

  const getTimetable = (week: number) => {
    const $timetable = allData.find((tt) => tt.weekInfo.selected === week);
    setWeekTimetable($timetable);
    timetable.updateData($timetable.weekInfo);
  };

  const timetable = useTimetable({
    onRequestUpdate: (week) => getTimetable(week),
    skipSunday,
  });

  useImperativeHandle(ref, () => ({
    refresh: () => refetch(),
  }));

  return (
    <TimetableContainer
      data={weekTimetable}
      timetable={timetable}
      // teachers={teachersData} TODO: add teacher from cache
      isLoading={isLoading || !weekTimetable}
      loadingComponent={() => <LoadingContainer />}
    />
  );
});

export default ICalTimetable;
