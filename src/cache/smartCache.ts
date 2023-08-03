import { ITimeTable } from '../models/timeTable';
import MappedCache from './mappedCache';
import FieldCache from './fieldCache';
import { UserCredentials } from '../redux/reducers/authSlice';
import { ISessionTeachPlan } from '../models/teachPlan';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';
import { ISessionRating } from '../models/rating';
import SecuredFieldCache from './securedFieldCache';
import { ThemeType } from '../redux/reducers/settingsSlice';
import { ITeacher, TeacherType } from '../models/teachers';
import { IOrder } from '../models/order';
import { IMessagesData } from '../models/messages';
import { StudentData } from '../models/student';

// TODO: Move it to somewhere

interface AppConfig {
  theme: ThemeType;
  signNotificationEnabled: boolean;
  introViewed: boolean;
  reviewStep: 'pending' | 'stop' | null;
  privacyPolicyAccepted: boolean;
}

export default class SmartCache {
  private keys = {
    // ETIS related keys
    ANNOUNCES: 'ANNOUNCES',
    MESSAGES: 'MESSAGES',
    ORDERS: 'ORDERS',
    ORDERS_INFO: 'ORDERS_INFO',
    SIGNS_POINTS: 'SIGNS_POINTS',
    SIGNS_MARKS: 'SIGNS_MARKS',
    SIGNS_RATING: 'SIGNS_RATING',
    STUDENT: 'STUDENT',
    TEACH_PLAN: 'TEACH_PLAN',
    TEACHERS: 'TEACHERS',
    TIMETABLE: 'TIMETABLE',

    // Internal keys
    USER: 'USER',
    CONFIG: 'CONFIG',
  };

  private announce: FieldCache<string[]>;
  private messages: MappedCache<number, IMessagesData>;
  private orders: {
    list: FieldCache<IOrder[]>;
    info: MappedCache<string, string>;
  };
  private timeTable: MappedCache<number, ITimeTable>;
  private teachers: FieldCache<TeacherType>;
  private teachPlan: FieldCache<ISessionTeachPlan[]>;
  private signsMarks: MappedCache<number, ISessionMarks>;
  private signsPoints: MappedCache<number, ISessionPoints>;
  private signsRating: MappedCache<number, ISessionRating>;
  private student: FieldCache<StudentData>;

  private user: SecuredFieldCache<UserCredentials>;
  private internal: FieldCache<AppConfig>;

  constructor() {
    this.announce = new FieldCache(this.keys.ANNOUNCES);
    this.messages = new MappedCache<number, IMessagesData>(this.keys.MESSAGES);
    this.orders = {
      list: new FieldCache<IOrder[]>(this.keys.ORDERS),
      info: new MappedCache<string, string>(this.keys.ORDERS_INFO),
    };
    this.timeTable = new MappedCache(this.keys.TIMETABLE);
    this.teachers = new FieldCache<TeacherType>(this.keys.TEACHERS);
    this.teachPlan = new FieldCache(this.keys.TEACH_PLAN);
    this.signsMarks = new MappedCache(this.keys.SIGNS_MARKS);
    this.signsPoints = new MappedCache(this.keys.SIGNS_POINTS);
    this.signsRating = new MappedCache(this.keys.SIGNS_RATING);
    this.student = new FieldCache<StudentData>(this.keys.STUDENT);

    this.user = new SecuredFieldCache<UserCredentials>(this.keys.USER);
    this.internal = new FieldCache<AppConfig>(this.keys.CONFIG);
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

  // Messages Region

  getMessages(page: number) {
    return this.messages.get(page);
  }

  async placeMessages(data: IMessagesData) {
    const page = Number.isNaN(data.page) ? 1 : data.page;
    this.messages.place(page, data);
    await this.messages.save();
  }

  // End Messages Region

  // Orders Region

  getOrders() {
    return this.orders.list.get();
  }

  async placeOrders(data: IOrder[]) {
    this.orders.list.place(data);
    await this.orders.list.save();
  }

  getOrder(orderID: string) {
    return this.orders.info.get(orderID);
  }

  async placeOrder(orderID: string, data: string) {
    this.orders.info.place(orderID, data);
    await this.orders.info.save();
  }

  // End Orders Region

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

  // Teachers Region

  getTeachers() {
    return this.teachers.get();
  }

  async placeTeachers(data: TeacherType) {
    this.teachers.place(data);
    await this.teachers.save();
  }

  // End Teachers Region

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

  // Student Region

  getStudent() {
    return this.student.get();
  }

  async placeStudent(data: StudentData) {
    this.student.place(data);

    await this.student.save();
  }

  // End Student Region

  // Secure Region

  getUserCredentials() {
    return this.user.get();
  }

  async placeUserCredentials(data: UserCredentials) {
    this.user.place(data);
    await this.user.save();
  }

  // End Secure Region

  // Internal Region

  getTheme() {
    const data = this.internal.get();
    return data.theme;
  }

  async placeTheme(theme: ThemeType) {
    const data = this.internal.get();
    data.theme = theme;
    this.internal.place(data);
    await this.internal.save();
  }

  getSignNotification() {
    const data = this.internal.get();
    return data.signNotificationEnabled;
  }

  async placeSignNotification(enabled: boolean) {
    const data = this.internal.get();
    data.signNotificationEnabled = enabled;
    this.internal.place(data);
    await this.internal.save();
  }

  getIntroViewed() {
    const data = this.internal.get();
    return data.introViewed;
  }

  async placeIntroViewed(status: boolean) {
    const data = this.internal.get();
    data.introViewed = status;
    this.internal.place(data);
    await this.internal.save();
  }

  getReviewStep() {
    return this.internal.get().reviewStep;
  }

  async setReviewStep(step: 'pending' | 'stop') {
    this.internal.get().reviewStep = step;

    await this.internal.save();
  }

  async bumpReviewRequest() {
    const step = this.getReviewStep();

    if (!step) {
      await this.setReviewStep('pending');
      return false;
    } else if (step === 'pending') {
      return true;
    }
  }

  hasAcceptedPrivacyPolicy() {
    return this.internal.get().privacyPolicyAccepted;
  }

  async setPrivacyPolicyStatus(status: boolean) {
    this.internal.get().privacyPolicyAccepted = status;

    await this.internal.save();
  }

  // End Internal Region
}
