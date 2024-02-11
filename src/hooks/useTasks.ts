import { useEffect, useState } from 'react';

import { DisciplineStorage, DisciplineTask } from '../models/disciplinesTasks';

const useTasks = ({ filter }: { filter?: (task: DisciplineTask) => boolean }) => {
  const [tasks, setTasks] = useState<DisciplineTask[]>([]);

  const setTasksWithFilter = (tasks: DisciplineTask[]) => {
    if (filter) setTasks(tasks.filter(filter));
    else setTasks(tasks);
  };

  useEffect(() => {
    DisciplineStorage.getTasks().then(setTasksWithFilter);
  }, []);

  const addTask = (task: DisciplineTask) =>
    DisciplineStorage.addTask(task).then(setTasksWithFilter);

  const removeTask = (task: DisciplineTask) =>
    DisciplineStorage.removeTask(task).then(setTasksWithFilter);

  const saveTasks = () => DisciplineStorage.saveTasks();

  return { tasks, addTask, removeTask, saveTasks };
};

export default useTasks;
