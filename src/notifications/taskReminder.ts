import notifee, { AndroidStyle } from '@notifee/react-native';

import { DisciplineTask } from '../models/disciplinesTasks';

export const sendReminderTaskNotification = async (task: DisciplineTask) => {
  const channelId = await notifee.createChannel({
    id: 'taskReminder',
    name: 'Канал напоминаний',
  });
  await notifee.displayNotification({
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
  });
};
