
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

interface IFileNotificationData extends IBaseNotificationData {
  type: 'file';
  data: {
    uri: string;
  };
}

export type INotificationData = ITaskReminderNotificationData | IFileNotificationData;
