import notifee, { Event, EventType } from '@notifee/react-native';

import { openFile } from '../utils/files';
import { rescheduleAllTaskNotifications } from './taskReminder';
import { INotificationData } from './types';

// Если для уведомления не требуется доступ к UI приложения,
// то их обработка должна быть произведена здесь

const handleEvent = async (event: Event) => {
  if (event.type !== EventType.PRESS) return;

  const data = event.detail.notification.data as unknown as INotificationData;
  if (data.type === 'file') {
    openFile(data.data.uri);
  }
  if (data.type === 'task-reminder') {
    rescheduleAllTaskNotifications({ taskId: data.data.taskId });
  }
};

notifee.onBackgroundEvent(handleEvent);
notifee.onForegroundEvent(handleEvent);
