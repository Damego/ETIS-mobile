import dayjs from 'dayjs';

import {
  readDisciplineInfo,
  readDisciplinesTasks,
  saveDisciplineInfo,
  saveDisciplinesTasks,
} from '../utils/files';
import { IDisciplineInfo, IDisciplineReminder, IDisciplineTask } from './disciplineInfo';

export class DisciplineReminder {
  datetime: dayjs.Dayjs;

  constructor(datetime: dayjs.Dayjs) {
    this.datetime = datetime;
  }

  toJSON(): IDisciplineReminder {
    return {
      datetime: this.datetime.toISOString(),
    };
  }

  static fromJSON(data: IDisciplineReminder) {
    return new DisciplineReminder(dayjs(data.datetime));
  }
}

export class DisciplineTask {
  id: number;
  disciplineName: string;
  description: string;
  datetime: dayjs.Dayjs;
  reminders: DisciplineReminder[];

  constructor(
    id: number,
    disciplineName: string,
    description: string,
    datetime: dayjs.Dayjs,
    reminders: DisciplineReminder[]
  ) {
    this.id = id;
    this.disciplineName = disciplineName;
    this.description = description;
    this.datetime = datetime;
    this.reminders = reminders;
  }

  toJSON(): IDisciplineTask {
    return {
      id: this.id,
      disciplineName: this.disciplineName,
      description: this.description,
      datetime: this.datetime.toISOString(),
      reminders: this.reminders.map((rem) => rem.toJSON()),
    };
  }

  static fromJSON(data: IDisciplineTask) {
    return new DisciplineTask(
      data.id,
      data.disciplineName,
      data.description,
      dayjs(data.datetime),
      data.reminders.map((rem) => DisciplineReminder.fromJSON(rem))
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
    this.tasks = this.tasks.filter($task => $task.id !== task.id);
    await this.saveTasks();
    return this.tasks;
  }

  static async saveTasks() {
    return saveDisciplinesTasks(DisciplineStorage.tasks.map((task) => task.toJSON()));
  }

  static async saveInfo() {
    return saveDisciplineInfo(DisciplineStorage.info);
  }

  static async saveAll() {
    await Promise.all([this.saveTasks(), this.saveInfo()]);
  }

  static async getTasks(): Promise<DisciplineTask[]> {
    await DisciplineStorage.read();
    return DisciplineStorage.tasks;
  }

  static async getInfo(): Promise<IDisciplineInfo[]> {
    await DisciplineStorage.read();
    return DisciplineStorage.info;
  }
}
