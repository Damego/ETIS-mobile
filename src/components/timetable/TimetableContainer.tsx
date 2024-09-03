import dayjs from 'dayjs';
import React from 'react';
import DayTimetable from '~/components/timetable/dayTimetable/DayTimetable';
import WeekTimetable from '~/components/timetable/weekTimetable/WeekTimetable';
import { useAppSelector } from '~/hooks';
import { IUseTimetable } from '~/hooks/useTimetable';
import { ITeacher } from '~/models/teachers';
import { ITimeTable } from '~/models/timeTable';
import { TimetableModes } from '~/redux/reducers/settingsSlice';

const TimetableContainer = ({
  data,
  teachers,
  timetable,
  startDate,
  endDate,
  isLoading,
  loadingComponent,
  firstWeek,
  lastWeek,
}: {
  timetable: IUseTimetable;
  data: ITimeTable;
  teachers?: ITeacher[];
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  isLoading?: boolean;
  loadingComponent?: () => React.ReactNode;
  firstWeek?: number;
  lastWeek?: number;
}) => {
  const { timetableMode } = useAppSelector((state) => state.settings.config.ui);
  const { currentDate, currentWeek, selectedDate, selectedWeek, onDatePress, onWeekPress } =
    timetable;

  if ((!selectedDate || !selectedWeek) && loadingComponent && isLoading) {
    return loadingComponent();
  }

  if (timetableMode === TimetableModes.weeks) {
    return (
      <WeekTimetable
        data={data}
        teachers={teachers}
        currentDate={currentDate}
        currentWeek={currentWeek}
        selectedWeek={selectedWeek}
        selectedDate={selectedDate}
        onWeekPress={onWeekPress}
        firstWeek={firstWeek}
        lastWeek={lastWeek}
        isLoading={isLoading}
        loadingComponent={loadingComponent}
      />
    );
  }
  return (
    <DayTimetable
      data={data}
      teachers={teachers}
      currentDate={currentDate}
      currentWeek={currentWeek}
      selectedWeek={selectedWeek}
      selectedDate={selectedDate}
      onDatePress={onDatePress}
      startDate={startDate}
      endDate={endDate}
      isLoading={isLoading}
      loadingComponent={loadingComponent}
    />
  );
};

export default TimetableContainer;
