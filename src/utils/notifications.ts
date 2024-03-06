import * as Notifications from 'expo-notifications';

import { DisciplineTask } from '../models/disciplinesTasks';

export const sendReminderTaskNotification = (task: DisciplineTask) => {
  console.log('[NOTIF] Sending task reminder notification...');
  const message =
    task.description.length < 30 ? task.description : `${task.description.slice(0, 29)}...`;
  Notifications.scheduleNotificationAsync({
    content: {
      title: task.disciplineName,
      body: `Напоминание о задании: ${message}`,
      data: {
        type: 'task-reminder',
        data: {
          taskId: task.id,
        },
      },
    },
    trigger: {
      seconds: 5,
      channelId: 'default',
    },
  });
};


interface IBaseNotificationData {
  type: string;
  data: unknown;
}

interface ITaskReminderNotificationData extends IBaseNotificationData {
  type: 'task-reminder';
  data: {
    taskId: number;
  };
}

export interface INotificationData extends ITaskReminderNotificationData {}
