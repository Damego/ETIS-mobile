import dayjs from 'dayjs';
import { createContext } from 'react';

import { DisciplineTask } from '../models/disciplinesTasks';

export interface ITaskContext {
  onRequestEdit: (task: DisciplineTask) => void;
  disciplineDate?: dayjs.Dayjs;
  onComplete: (task: DisciplineTask) => void;
}

const defaultValue: ITaskContext = {
  onRequestEdit: undefined,
  disciplineDate: undefined,
  onComplete: undefined,
};

const TaskContext = createContext<ITaskContext>(defaultValue);

export default TaskContext;
