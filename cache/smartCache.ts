import { ITimeTable } from '../src/models/timeTable';
import MappedCache from "./mappedCache";
import FieldCache from "./fieldCache";
import {ISessionTeachPlan} from "../src/models/teachPlan";

export default class SmartCache {
  private keys = {
    // ETIS related keys
    ANNOUNCES: 'ANNOUNCES',
    MESSAGES: 'MESSAGES',
    ORDERS: 'ORDERS',
    SIGNS_POINTS: 'SIGNS_POINTS',
    SIGNS_MARKS: 'SIGNS_MARKS',
    SIGNS_RATING: 'SIGNS_RATING',
    STUDENT: 'STUDENT',
    TEACH_PLAN: 'TEACH_PLAN',
    TEACHERS: 'TEACHERS',
    TIMETABLE: 'TIMETABLE',

    // Internal keys
    THEME: 'THEME',
    SIGN_NOTIFICATION: 'SIGN_NOTIFICATION',
    VIEWED_INTRO: 'VIEWED_INTRO',
  };

  public timeTable: MappedCache<number, ITimeTable>;
  private teachPlan: FieldCache<ISessionTeachPlan[]>;

  constructor() {
    this.timeTable = new MappedCache(this.keys.TIMETABLE);
    this.teachPlan = new FieldCache(this.keys.TEACH_PLAN);
  }

  // TimeTable region

  async getTimeTable(week: number) {
    return await this.timeTable.get(week);
  }

  async placeTimeTable(data: ITimeTable) {
    return await this.timeTable.place(data.selectedWeek, data);
  }

  async deleteTimeTable(week: number) {
    await this.timeTable.delete(week);
  }

  // End TimeTable region

  // TeachPlan Region

  async getTeachPlan() {
    return await this.teachPlan.get();
  }

  async placeTeachPlan(teachPlan: ISessionTeachPlan[]) {
    await this.teachPlan.place(teachPlan);
  }

  // End TeachPlan Region
}
