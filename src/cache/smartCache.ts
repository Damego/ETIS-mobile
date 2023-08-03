import { ITimeTable } from '../src/models/timeTable';
import MappedCache from './mappedCache';
import FieldCache from './fieldCache';
import { ISessionTeachPlan } from '../src/models/teachPlan';
import { ISessionMarks } from '../src/models/sessionMarks';
import { ISessionPoints } from '../src/models/sessionPoints';
import { ISessionRating } from '../src/models/rating';

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

  private announce: FieldCache<string[]>;
  private timeTable: MappedCache<number, ITimeTable>;
  private teachPlan: FieldCache<ISessionTeachPlan[]>;
  private signsMarks: MappedCache<number, ISessionMarks>;
  private signsPoints: MappedCache<number, ISessionPoints>;
  private signsRating: MappedCache<number, ISessionRating>;

  constructor() {
    this.announce = new FieldCache(this.keys.ANNOUNCES);
    this.timeTable = new MappedCache(this.keys.TIMETABLE);
    this.teachPlan = new FieldCache(this.keys.TEACH_PLAN);
    this.signsMarks = new MappedCache(this.keys.SIGNS_MARKS);
    this.signsPoints = new MappedCache(this.keys.SIGNS_POINTS);
    this.signsRating = new MappedCache(this.keys.SIGNS_RATING);
  }

  // Announce Region

  async getAnnounce() {
    return await this.announce.get();
  }

  async placeAnnounce(data: string[]) {
    await this.announce.place(data);
    await this.announce.stringify();
  }

  // End Announce Region

  // TimeTable region

  async getTimeTable(week: number) {
    return await this.timeTable.get(week);
  }

  async placeTimeTable(data: ITimeTable) {
    await this.timeTable.place(data.selectedWeek, data);
    await this.timeTable.stringify();
  }

  async deleteTimeTable(week: number) {
    await this.timeTable.delete(week);
    await this.timeTable.stringify();
  }

  // End TimeTable region

  // TeachPlan Region

  async getTeachPlan() {
    return await this.teachPlan.get();
  }

  async placeTeachPlan(teachPlan: ISessionTeachPlan[]) {
    await this.teachPlan.place(teachPlan);
    await this.teachPlan.stringify();
  }

  // End TeachPlan Region

  // Region Signs

  // // Marks Region

  async getSessionMarks(session: number) {
    return await this.signsMarks.get(session);
  }

  async placeSessionMarks(data: ISessionMarks[]) {
    data.every((d) => {
      this.signsMarks.place(d.fullSessionNumber, d);
    });

    await this.signsMarks.stringify();
  }

  // // End Marks Region

  // // Points Region

  async getSessionPoints(session: number) {
    return await this.signsPoints.get(session);
  }

  async placeSessionPoints(data: ISessionPoints) {
    await this.signsPoints.place(data.currentSession, data);
    await this.signsPoints.stringify();
  }

  // // End Points Region

  // // Rating Region

  async getSessionRating(session: number) {
    return await this.signsRating.get(session);
  }

  async placeSessionRating(data: ISessionRating) {
    await this.signsRating.place(data.session.current, data);
  }

  // // End Rating Region

  // End Signs Region
}
