import dayjs from 'dayjs';
import { createContext, useContext } from 'react';

import { DisciplineTask } from '../models/disciplinesTasks';

export interface ITaskContext {
  onRequestEdit: (task: DisciplineTask) => void;
  disciplineDate?: dayjs.Dayjs;
  onComplete: (task: DisciplineTask) => void;
}

// Провайдер (TaskContainer) всегда задаёт оба колбэка
const TaskContext = createContext<ITaskContext | undefined>(undefined);

export default TaskContext;

export const useTaskContext = (): ITaskContext => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskContext.Provider');
  }
  return context;
};
