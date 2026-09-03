import dayjs from 'dayjs';

import { DisciplineTask } from '~/models/disciplinesTasks';
import { compareTime } from '~/utils/datetime';
import { groupItems } from '~/utils/utils';

const sortTaskGroups = (group1: DisciplineTask[], group2: DisciplineTask[]) => {
  const first = group1[0].datetime;
  const second = group2[0].datetime;
  if (!first) return -1;
  if (!second) return 1;

  return compareTime(first, second);
};

const getGroupedTasks = (tasks: DisciplineTask[], currentDate: dayjs.Dayjs) => {
  const inactiveTasks = tasks
    .filter((task) => (task.datetime && task.datetime < currentDate) || task.isComplete)
    .reverse();
  const groupedInactiveTasks = groupItems(inactiveTasks, (task) =>
    task.datetime ? task.datetime.toISOString() : 'no-datetime'
  ).sort(sortTaskGroups);

  const activeTasks = tasks.filter(
    (task) =>
      (task.datetime && task.datetime >= currentDate) || (!task.datetime && !task.isComplete)
  );
  const groupedActiveTasks = groupItems(activeTasks, (task) =>
    task.datetime ? task.datetime.toISOString() : 'no-datetime'
  ).sort(sortTaskGroups);

  return { groupedActiveTasks, groupedInactiveTasks };
};

export default getGroupedTasks;
