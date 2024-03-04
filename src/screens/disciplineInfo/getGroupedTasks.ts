import dayjs from 'dayjs';

import { DisciplineTask } from '../../models/disciplinesTasks';
import { compareTime } from '../../utils/datetime';
import { groupItems } from '../../utils/utils';

const sortTaskGroups = (group1: DisciplineTask[], group2: DisciplineTask[]) => {
  if (!group1[0].datetime) return -1;
  if (!group1[0].datetime) return 1;

  return compareTime(group1[0].datetime, group2[0].datetime);
};

const getGroupedTasks = (tasks: DisciplineTask[], currentDate: dayjs.Dayjs) => {
  const inactiveTasks = tasks
    .filter((task) => (task.datetime && task.datetime < currentDate) || task.isComplete)
    .reverse();
  const groupedInactiveTasks = groupItems(inactiveTasks, (task) =>
    task.datetime ? task.datetime.toISOString() : 'no-datetime'
  ).sort(sortTaskGroups);

  const activeTasks = tasks.filter(
    (task) => (task.datetime && task.datetime >= currentDate) || !task.isComplete
  );
  const groupedActiveTasks = groupItems(activeTasks, (task) =>
    task.datetime ? task.datetime.toISOString() : 'no-datetime'
  ).sort(sortTaskGroups);

  return {groupedActiveTasks, groupedInactiveTasks};
};

export default getGroupedTasks;
