import notifee, { AndroidStyle, TriggerType } from '@notifee/react-native';
import dayjs from 'dayjs';

import { DisciplineStorage, DisciplineTask } from '../models/disciplinesTasks';
import { partitionItems } from '../utils/utils';

export const scheduleTaskNotifications = async (task: DisciplineTask) => {
  const channelId = await notifee.createChannel({
    id: 'taskReminder',
    name: 'Канал напоминаний',
  });

  task.reminders.map(async (reminder) => {
    console.log(reminder.datetime.toDate().getTime());
    reminder.notificationId = await notifee.createTriggerNotification(
      {
        title: 'Напоминание о задании',
        subtitle: task.disciplineName,
        body: task.description,
        data: {
          type: 'task-reminder',
          data: {
            taskId: task.id,
          },
        },
        android: {
          pressAction: {
            id: 'default',
          },
          channelId,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: task.description,
          },
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: reminder.datetime.toDate().getTime(),
      }
    );
  });
};

export const cancelScheduledTaskNotifications = ({
  task,
  notificationIds,
}: {
  task?: DisciplineTask;
  notificationIds?: string[];
}) => {
  notificationIds = notificationIds ?? task.reminders.map((rem) => rem.notificationId);
  return notifee.cancelTriggerNotifications(notificationIds);
};

export const rescheduleTaskNotifications = async (previous: string[], task: DisciplineTask) => {
  await cancelScheduledTaskNotifications({ notificationIds: previous });
  scheduleTaskNotifications(task);
};

export const invalidateOutdatedTaskNotifications = async ({
  task,
  taskId,
}: {
  task?: DisciplineTask;
  taskId?: string;
} = {}) => {
  let tasks: DisciplineTask[] = [];
  if (task) tasks.push(task);
  else if (taskId) tasks.push(await DisciplineStorage.getTaskById(taskId));
  else tasks = await DisciplineStorage.getTasks();
  const currentDate = dayjs();

  tasks.forEach((task) => {
    const [oldReminders, futureReminders] = partitionItems(
      task.reminders,
      (reminder) => currentDate.diff(reminder.datetime, 'minute') >= 0
    );
    const notificationIds = oldReminders.map((rem) => rem.notificationId);
    cancelScheduledTaskNotifications({ notificationIds });
    task.reminders = futureReminders;
    DisciplineStorage.saveTasks();
  });
};
