import dayjs from 'dayjs';
import { createContext, useContext } from 'react';
import { ITeacher } from '~/models/teachers';

interface ITimeTableContext {
  teachers?: ITeacher[];
  currentDate?: dayjs.Dayjs;
}

const TimeTableContext = createContext<ITimeTableContext>({});

export default TimeTableContext;

export const useTimetableContext = () => useContext(TimeTableContext);
