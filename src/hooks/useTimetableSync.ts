import React from 'react';

import { IUseTimetable } from '~/hooks/useTimetable';

/**
 * Связка «полученные данные расписания → состояние useTimetable».
 *
 * Раньше каждый экран после запроса вручную вызывал
 * `timetable.updateData(data.weekInfo)` — в afterCallback useQuery или в
 * useEffect с зависимостью [data]. Второй вариант был багоопасен:
 * updateData пересоздаётся на каждом рендере, и эффект мог вызвать
 * устаревшую версию.
 *
 * Хук сам синхронизирует состояние при появлении/обновлении данных.
 * getWeekInfo извлекает WeekInfo из данных (данные у экранов разные:
 * ITimeTable, результат с массивом расписаний и т.д.).
 */
const useTimetableSync = <T>(
  timetable: IUseTimetable,
  data: T | undefined,
  getWeekInfo: (data: T) => Parameters<IUseTimetable['updateData']>[0] | undefined
) => {
  const updateDataRef = React.useRef(timetable.updateData);
  updateDataRef.current = timetable.updateData;

  const getWeekInfoRef = React.useRef(getWeekInfo);
  getWeekInfoRef.current = getWeekInfo;

  React.useEffect(() => {
    if (!data) return;

    const weekInfo = getWeekInfoRef.current(data);
    if (weekInfo) updateDataRef.current(weekInfo);
  }, [data]);
};

export default useTimetableSync;
