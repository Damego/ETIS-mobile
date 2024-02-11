import dayjs from 'dayjs';
import * as BackgroundFetch from 'expo-background-fetch';
import { BackgroundFetchResult } from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { DisciplineReminder, DisciplineStorage, DisciplineTask } from '../models/disciplinesTasks';
import { sendReminderTaskNotification } from '../utils/notifications';
import { partitionItems } from '../utils/utils';

const BACKGROUND_FETCH_TASK = 'discipline-tasks-fetch';

const groupReminders = (task: DisciplineTask, datetime: dayjs.Dayjs): DisciplineReminder[][] =>
  partitionItems(task.reminders, (reminder) => datetime.diff(reminder.datetime, 'minute') > 1);

export const defineReminderTask = () =>
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const tasks = await DisciplineStorage.getTasks();
    if (tasks.length === 0) {
      return BackgroundFetchResult.NoData;
    }

    const datetime = dayjs();
    tasks
      .filter((task) => !!task.reminders.length)
      .forEach((task) => {
        const [futureReminders, oldReminders] = groupReminders(task, datetime);
        oldReminders.forEach(() => {
          sendReminderTaskNotification(task);
        });
        task.reminders = futureReminders;
        DisciplineStorage.saveTasks();
      });

    return BackgroundFetchResult.NewData;
  });

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60, // 1 minute
    stopOnTerminate: false, // android only,
    startOnBoot: false, // android only
  });
}

export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export const registerReminderTask = async () => {
  registerBackgroundFetchAsync().then(() => console.log('[FETCH] Reminder task registered'));
};
