import { useCallback, useEffect, useState } from 'react';

import { DisciplineStorage, DisciplineTask } from '../models/disciplinesTasks';

const useTasks = ({ filter }: { filter?: (task: DisciplineTask) => boolean } = {}) => {
  const [tasks, setTasks] = useState<DisciplineTask[]>([]);

  const setTasksWithFilter = useCallback(
    (tasks: DisciplineTask[]) => {
      if (filter) setTasks([...tasks].filter(filter));
      else setTasks([...tasks]);
    },
    [filter]
  );

  useEffect(() => {
    DisciplineStorage.getTasks().then(setTasksWithFilter);
  }, []);

  const addTask = useCallback(
    (task: DisciplineTask) => DisciplineStorage.addTask(task).then(setTasksWithFilter),
    []
  );

  const removeTask = useCallback(
    (task: DisciplineTask) => DisciplineStorage.removeTask(task).then(setTasksWithFilter),
    []
  );

  const saveTasks = useCallback(
    () =>
      DisciplineStorage.saveTasks().then(() =>
        DisciplineStorage.getTasks().then(setTasksWithFilter)
      ),
    []
  );

  return { tasks, addTask, removeTask, saveTasks };
};

export default useTasks;
