import { createContext } from 'react';

import { ITeacher } from '../models/teachers';

interface ITimeTableContext {
  teachers?: ITeacher[];
}

const TimeTableContext = createContext<ITimeTableContext>({});

export default TimeTableContext;