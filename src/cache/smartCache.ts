import { ITimeTable } from '../models/timeTable';
import MappedCache from './mappedCache';
import FieldCache from './fieldCache';
import { ISessionTeachPlan } from '../models/teachPlan';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';
import { ISessionRating } from '../models/rating';

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

  getAnnounce() {
    return this.announce.get();
  }

  async placeAnnounce(data: string[]) {
    this.announce.place(data);
    await this.announce.save();
  }

  // End Announce Region

  // TimeTable region

  getTimeTable(week: number) {
    return this.timeTable.get(week);
  }

  async placeTimeTable(data: ITimeTable) {
    this.timeTable.place(data.selectedWeek, data);
    await this.timeTable.save();
  }

  async deleteTimeTable(week: number) {
    this.timeTable.delete(week);
    await this.timeTable.save();
  }

  // End TimeTable region

  // TeachPlan Region

  getTeachPlan() {
    return this.teachPlan.get();
  }

  async placeTeachPlan(teachPlan: ISessionTeachPlan[]) {
    this.teachPlan.place(teachPlan);
    await this.teachPlan.save();
  }

  // End TeachPlan Region

  // Region Signs

  // // Marks Region

  getSessionMarks(session: number) {
    return this.signsMarks.get(session);
  }

  async placeSessionMarks(data: ISessionMarks[]) {
    data.every((d) => {
      this.signsMarks.place(d.fullSessionNumber, d);
    });

    await this.signsMarks.save();
  }

  // // End Marks Region

  // // Points Region

  getSessionPoints(session: number) {
    return this.signsPoints.get(session);
  }

  async placeSessionPoints(data: ISessionPoints) {
    this.signsPoints.place(data.currentSession, data);
    await this.signsPoints.save();
  }

  // // End Points Region

  // // Rating Region

  getSessionRating(session: number) {
    return this.signsRating.get(session);
  }

  async placeSessionRating(data: ISessionRating) {
    this.signsRating.place(data.session.current, data);
    await this.signsRating.save();
  }

  // // End Rating Region

  // End Signs Region
}
