import React, { useImperativeHandle } from 'react';
import { cache } from '~/cache/smartCache';
import { LoadingContainer } from '~/components/LoadingScreen';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import { useClient } from '~/data/client';
import { useAppDispatch, useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import useTimetable from '~/hooks/useTimetable';
import { parseICalToken } from '~/parser/ical';
import { setICalToken } from '~/redux/reducers/studentSlice';
import { httpClient } from '~/utils';

export interface EducationTimetableMethods {
  refresh: () => void;
}

const EducationTimetable = React.forwardRef<EducationTimetableMethods>((props, ref) => {
  console.log("IN EDUCATION TT")
  const client = useClient();
  const dispatch = useAppDispatch();
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);
  const iCalToken = useAppSelector((state) => state.student.iCalToken);

  const timetable = useTimetable({
    onRequestUpdate: (week) => loadWeek(week),
    skipSunday,
  });

  useImperativeHandle(ref, () => ({
    refresh: () => refresh(),
  }));

  const { data, isLoading, loadWeek, refresh } = useTimeTableQuery({
    week: timetable.selectedWeek,
    afterCallback: (result) => {
      timetable.updateData(result.data.weekInfo);

      if (result.data.icalToken && result.data.icalToken !== iCalToken) {
        dispatch(setICalToken(result.data.icalToken));
        cache.placePartialStudent({ iCalToken: result.data.icalToken });
      } else if (!result.data.icalToken) {
        httpClient.subscribeICalendar().then((res) => {
          const token = parseICalToken(res.data);
          dispatch(setICalToken(token));
          cache.placePartialStudent({ iCalToken: token });
        });
      }
    },
  });

  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
  });

  return (
    <TimetableContainer
      data={data}
      timetable={timetable}
      teachers={teachersData}
      isLoading={isLoading || teachersIsLoading || !data}
      loadingComponent={() => <LoadingContainer />}
    />
  );
});

export default EducationTimetable;
