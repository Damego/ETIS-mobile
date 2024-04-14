import dayjs from 'dayjs';
import 'react-native-get-random-values';
import { v4 as uuid4 } from 'uuid';

import {
  readDisciplineInfo,
  readDisciplinesTasks,
  saveDisciplineInfo,
  saveDisciplinesTasks,
} from '../utils/files';
import { IDisciplineInfo, IDisciplineReminder, IDisciplineTask } from './disciplineInfo';

export class DisciplineReminder {
  datetime: dayjs.Dayjs;
  notificationId?: string;

  constructor(datetime: dayjs.Dayjs, notificationId?: string) {
    this.datetime = datetime;
    this.notificationId = notificationId;
  }

  toJSON(): IDisciplineReminder {
    return {
      datetime: this.datetime.toISOString(),
      notificationId: this.notificationId,
    };
  }

  static fromJSON(data: IDisciplineReminder) {
    return new DisciplineReminder(dayjs(data.datetime), data.notificationId);
  }
}

export class DisciplineTask {
  id: string;
  disciplineName: string;
  description: string;
  datetime: dayjs.Dayjs | null;
  reminders: DisciplineReminder[];
  isComplete: boolean;

  constructor(
    id: string,
    disciplineName: string,
    description: string,
    datetime: dayjs.Dayjs | null,
    reminders: DisciplineReminder[],
    isComplete: boolean
  ) {
    this.id = id;
    this.disciplineName = disciplineName;
    this.description = description;
    this.datetime = datetime;
    this.reminders = reminders;
    this.isComplete = isComplete;
  }

  static create(
    disciplineName: string,
    description: string,
    datetime: dayjs.Dayjs | null,
    reminders: DisciplineReminder[],
    isComplete: boolean
  ) {
    return new DisciplineTask(
      uuid4(),
      disciplineName,
      description.trim(),
      datetime,
      reminders,
      isComplete
    );
  }

  toJSON(): IDisciplineTask {
    return {
      id: this.id,
      disciplineName: this.disciplineName,
      description: this.description,
      datetime: this.datetime ? this.datetime.toISOString() : null,
      reminders: this.reminders.map((rem) => rem.toJSON()),
      isComplete: this.isComplete,
    };
  }

  static fromJSON(data: IDisciplineTask) {
    return new DisciplineTask(
      data.id,
      data.disciplineName,
      data.description,
      data.datetime ? dayjs(data.datetime) : null,
      data.reminders.map((rem) => DisciplineReminder.fromJSON(rem)),
      data.isComplete
    );
  }
}

export class DisciplineStorage {
  private static tasks: DisciplineTask[] = [];
  private static info: IDisciplineInfo[] = [];
  private static isRead: boolean = false;

  static async read() {
    if (DisciplineStorage.isRead) return;

    const [tasks, info] = await Promise.all([readDisciplinesTasks(), readDisciplineInfo()]);

    if (tasks) DisciplineStorage.tasks = tasks.map((task) => DisciplineTask.fromJSON(task));
    if (info) DisciplineStorage.info = info;

    DisciplineStorage.isRead = true;
  }

  static async addTask(task: DisciplineTask) {
    this.tasks.push(task);
    await this.saveTasks();
    return this.tasks;
  }

  static async removeTask(task: DisciplineTask) {
    this.tasks = this.tasks.filter(($task) => $task.id !== task.id);
    await this.saveTasks();
    return this.tasks;
  }

  static async saveTasks() {
    return saveDisciplinesTasks(DisciplineStorage.tasks.map((task) => task.toJSON()));
  }

  static async saveInfo() {
    return saveDisciplineInfo(DisciplineStorage.info);
  }

  static async getTasks(): Promise<DisciplineTask[]> {
    await DisciplineStorage.read();
    return DisciplineStorage.tasks;
  }

  static async getInfo(): Promise<IDisciplineInfo[]> {
    await DisciplineStorage.read();
    return DisciplineStorage.info;
  }

  static async getTaskById(id: string): Promise<DisciplineTask> {
    const tasks = await this.getTasks();
    return tasks.find((task) => task.id === id);
  }
}
