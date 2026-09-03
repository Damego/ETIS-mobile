import dayjs from 'dayjs';
import { createContext, useContext } from 'react';

import { ITeacher } from '~/models/teachers';

interface ITimeTableContext {
  teachers?: ITeacher[];
  currentDate: dayjs.Dayjs;
  currentWeek?: number;
  selectedDate: dayjs.Dayjs;
  selectedWeek?: number;
}

// Провайдеры (DayTimetable/WeekTimetable) всегда задают currentDate/selectedDate
const TimeTableContext = createContext<ITimeTableContext | undefined>(undefined);

export default TimeTableContext;

export const useTimetableContext = (): ITimeTableContext => {
  const context = useContext(TimeTableContext);
  if (!context) {
    throw new Error('useTimetableContext must be used within TimeTableContext.Provider');
  }
  return context;
};
