import dayjs from 'dayjs';
import React from 'react';

import type { PagerScrollState } from '~/components/timetable/dayTimetable/components/TimetablePages';
import DayTimetable from '~/components/timetable/dayTimetable/DayTimetable';
import WeekTimetable from '~/components/timetable/weekTimetable/WeekTimetable';
import { useAppSelector } from '~/hooks';
import useOfflineMode from '~/hooks/useOfflineMode';
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
  onRetry,
  onPagerScrollStateChange,
}: {
  readonly timetable: IUseTimetable;
  readonly data?: ITimeTable | null;
  readonly teachers?: ITeacher[];
  readonly startDate?: dayjs.Dayjs;
  readonly endDate?: dayjs.Dayjs;
  readonly isLoading?: boolean;
  readonly loadingComponent?: () => React.ReactNode;
  readonly firstWeek?: number;
  readonly lastWeek?: number;
  readonly onRetry?: () => void;
  readonly onPagerScrollStateChange?: (state: PagerScrollState) => void;
}) => {
  const { timetableMode } = useAppSelector((state) => state.settings.config.ui);
  // В оффлайн-режиме кнопка «Обновить» не имеет смысла — не пробрасываем onRetry
  const retryHandler = useOfflineMode() ? undefined : onRetry;
  const { currentDate, currentWeek, selectedDate, selectedWeek, onDatePress, onWeekPress } =
    timetable;

  if ((!selectedDate || !selectedWeek) && loadingComponent && isLoading) {
    return loadingComponent();
  }

  if (timetableMode === TimetableModes.weeks) {
    return (
      <WeekTimetable
        data={data}
        teachers={teachers ?? []}
        currentDate={currentDate}
        currentWeek={currentWeek}
        selectedWeek={selectedWeek}
        selectedDate={selectedDate}
        firstWeek={firstWeek}
        lastWeek={lastWeek}
        isLoading={isLoading}
        loadingComponent={loadingComponent}
        onWeekPress={onWeekPress}
        onRetry={retryHandler}
      />
    );
  }
  return (
    <DayTimetable
      data={data}
      teachers={teachers ?? []}
      currentDate={currentDate}
      currentWeek={currentWeek}
      selectedWeek={selectedWeek}
      selectedDate={selectedDate}
      startDate={startDate}
      endDate={endDate}
      isLoading={isLoading}
      loadingComponent={loadingComponent}
      onDatePress={onDatePress}
      onRetry={retryHandler}
      onPagerScrollStateChange={onPagerScrollStateChange}
    />
  );
};

export default TimetableContainer;
