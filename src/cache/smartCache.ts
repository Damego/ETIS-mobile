import * as SecureStore from 'expo-secure-store';
import { IAbsence } from '~/models/absences';
import { IAnnounce } from '~/models/announce';
import { ICalendarSchedule } from '~/models/calendarSchedule';
import { ICathedraTimetable, ICathedraTimetablePayload } from '~/models/cathedraTimetable';
import { ICertificate, ICertificateResult } from '~/models/certificate';
import { IGroupTimetablePayload } from '~/models/groupTimetable';
import { IMessagesData } from '~/models/messages';
import { IOrder } from '~/models/order';
import { IPersonalRecord } from '~/models/personalRecords';
import { IPointUpdates } from '~/models/pointUpdates';
import { ISessionRating } from '~/models/rating';
import { ISessionMarks } from '~/models/sessionMarks';
import { ISessionPoints } from '~/models/sessionPoints';
import { ISessionTeachPlan } from '~/models/teachPlan';
import { ITeacher } from '~/models/teachers';
import { ITimeTable } from '~/models/timeTable';
import { StudentInfo } from '~/parser/menu';
import {
  TeacherState,
  UnauthorizedStudentState,
  UserCredentials,
} from '~/redux/reducers/accountSlice';
import { AppConfig, UIConfig } from '~/redux/reducers/settingsSlice';
import { ThemeType } from '~/styles/themes';
import { Events } from '~/utils/events';

import FieldCache from './fieldCache';
import MappedCache from './mappedCache';
import SecuredFieldCache from './securedFieldCache';

export interface Account {
  teacher?: TeacherState;
  student?: UnauthorizedStudentState;
}

export default class SmartCache {
  absences: MappedCache<number, IAbsence>;
  announce: FieldCache<IAnnounce[]>;
  messages: MappedCache<number, IMessagesData>;
  orders: {
    list: FieldCache<IOrder[]>;
    info: MappedCache<string, string>;
  };
  personalRecords: FieldCache<IPersonalRecord[]>;
  timeTable: MappedCache<number, ITimeTable>;
  teachers: FieldCache<ITeacher[]>;
  teachPlan: FieldCache<ISessionTeachPlan[]>;
  pointUpdates: MappedCache<string, IPointUpdates>;
  signsMarks: MappedCache<number, ISessionMarks>;
  signsPoints: MappedCache<number, ISessionPoints>;
  signsRating: MappedCache<number, ISessionRating>;
  student: FieldCache<StudentInfo>;
  calendarSchedule: FieldCache<ICalendarSchedule>;
  certificate: FieldCache<ICertificate[]>;
  cathedraTimetable: MappedCache<string, ICathedraTimetable>;
  groupTimetable: MappedCache<string, ITimeTable>;

  // Internal
  user: SecuredFieldCache<UserCredentials>;
  account: FieldCache<Account>;
  app: FieldCache<AppConfig>;

  private keys = {
    // ETIS related keys
    ABSENCES: 'ABSENCES',
    ANNOUNCES: 'ANNOUNCES',
    CALENDAR_SCHEDULE: 'CALENDAR_SCHEDULE',
    CERTIFICATE: 'CERTIFICATE',
    MESSAGES: 'MESSAGES',
    ORDERS: 'ORDERS',
    ORDERS_INFO: 'ORDERS_INFO',
    PERSONAL_RECORDS: 'PERSONAL_RECORDS',
    POINT_UPDATES: 'POINT_UPDATES',
    SIGNS_POINTS: 'SIGNS_POINTS',
    SIGNS_MARKS: 'SIGNS_MARKS',
    SIGNS_RATING: 'SIGNS_RATING',
    STUDENT: 'STUDENT',
    TEACH_PLAN: 'TEACH_PLAN',
    TEACHERS: 'TEACHERS',
    TIMETABLE: 'TIMETABLE',
    CATHEDRA_TIMETABLE: 'CATHEDRA_TIMETABLE',
    GROUP_TIMETABLE: 'GROUP_TIMETABLE',

    // Internal keys
    USER: 'USER',
    ACCOUNT: 'ACCOUNT',
    APP: 'APP',
  };

  constructor() {
    this.absences = new MappedCache<number, IAbsence>(this.keys.ABSENCES);
    this.announce = new FieldCache(this.keys.ANNOUNCES);
    this.messages = new MappedCache<number, IMessagesData>(this.keys.MESSAGES);
    this.orders = {
      list: new FieldCache<IOrder[]>(this.keys.ORDERS),
      info: new MappedCache<string, string>(this.keys.ORDERS_INFO),
    };
    this.personalRecords = new FieldCache(this.keys.PERSONAL_RECORDS);
    this.timeTable = new MappedCache(this.keys.TIMETABLE);
    this.teachers = new FieldCache(this.keys.TEACHERS);
    this.teachPlan = new FieldCache(this.keys.TEACH_PLAN);
    this.pointUpdates = new MappedCache(this.keys.POINT_UPDATES);
    this.signsMarks = new MappedCache(this.keys.SIGNS_MARKS);
    this.signsPoints = new MappedCache(this.keys.SIGNS_POINTS);
    this.signsRating = new MappedCache(this.keys.SIGNS_RATING);
    this.student = new FieldCache<StudentInfo>(this.keys.STUDENT);
    this.calendarSchedule = new FieldCache(this.keys.CALENDAR_SCHEDULE);
    this.certificate = new FieldCache(this.keys.CERTIFICATE);
    this.cathedraTimetable = new MappedCache<string, ICathedraTimetable>(
      this.keys.CATHEDRA_TIMETABLE
    );
    this.groupTimetable = new MappedCache<string, ITimeTable>(this.keys.GROUP_TIMETABLE);

    this.user = new SecuredFieldCache<UserCredentials>(this.keys.USER);
    this.app = new FieldCache<AppConfig>(this.keys.APP);
    this.account = new FieldCache<Account>(this.keys.ACCOUNT);
  }

  // Absences Region

  async getAbsences(session: number) {
    if (!this.absences.isReady()) await this.absences.init();
    return this.absences.get(session);
  }

  async placeAbsences(data: IAbsence) {
    this.absences.place(data.currentSession.number, data);
    await this.absences.save();
  }

  // End Absences Region

  // Announce Region

  async getAnnounce() {
    if (!this.announce.isReady()) await this.announce.init();
    return this.announce.get();
  }

  async placeAnnounce(data: IAnnounce[]) {
    this.announce.place(data);
    await this.announce.save();
  }

  // End Announce Region

  // Messages Region

  async getMessages(page: number) {
    if (!this.messages.isReady()) await this.messages.init();
    return this.messages.get(page);
  }

  async placeMessages(data: IMessagesData) {
    const page = Number.isNaN(data.page) ? 1 : data.page;
    this.messages.place(page, data);
    await this.messages.save();
  }

  // End Messages Region

  // Orders Region

  async getOrders() {
    if (!this.orders.list.isReady()) await this.orders.list.init();
    return this.orders.list.get();
  }

  async placeOrders(data: IOrder[]) {
    this.orders.list.place(data);
    await this.orders.list.save();
  }

  async getOrder(orderID: string) {
    if (!this.orders.info.isReady()) await this.orders.info.init();
    return this.orders.info.get(orderID);
  }

  async placeOrder(orderID: string, data: string) {
    this.orders.info.place(orderID, data);
    await this.orders.info.save();
  }

  // End Orders Region

  // TimeTable region

  async getTimeTable(week: number) {
    if (!this.timeTable.isReady()) await this.timeTable.init();
    return this.timeTable.get(week);
  }

  async placeTimeTable(data: ITimeTable) {
    this.timeTable.place(data.weekInfo.selected, data);
    await this.timeTable.save();
  }

  async clearTimeTable() {
    await this.timeTable.init();
    await this.timeTable.clear();
    await this.timeTable.save();
  }

  hasTimeTableWeek(week: number) {
    return this.timeTable.isReady() && this.timeTable.get(week) !== undefined;
  }

  // End TimeTable region

  // Teachers Region

  async getTeachers() {
    await this.teachers.init();
    return this.teachers.get();
  }

  async placeTeachers(data: ITeacher[]) {
    this.teachers.place(data);
    await this.teachers.save();
  }

  // End Teachers Region

  // TeachPlan Region

  async getTeachPlan() {
    if (!this.teachPlan.isReady()) await this.teachPlan.init();
    return this.teachPlan.get();
  }

  async placeTeachPlan(teachPlan: ISessionTeachPlan[]) {
    this.teachPlan.place(teachPlan);
    await this.teachPlan.save();
  }

  // End TeachPlan Region

  // Region Signs

  // // PointUpdates Region

  async getPointUpdates(url: string): Promise<IPointUpdates> {
    if (!this.pointUpdates.isReady()) await this.pointUpdates.init();
    return this.pointUpdates.get(url);
  }

  async placePointUpdates(data: IPointUpdates) {
    this.pointUpdates.place(data.url, data);
    await this.pointUpdates.save();
  }

  // // End PointUpdates Region

  // // Marks Region

  async getSessionMarks(session: number) {
    if (!this.signsMarks.isReady()) await this.signsMarks.init();
    return this.signsMarks.get(session);
  }

  async getAllSessionMarks() {
    if (!this.signsMarks.isReady()) await this.signsMarks.init();
    return this.signsMarks.values();
  }

  async placeSessionMarks(data: ISessionMarks[]) {
    data.forEach((d) => {
      this.signsMarks.place(d.session, d);
    });

    await this.signsMarks.save();
  }

  // // End Marks Region

  // // Points Region

  async getSessionPoints(session: number) {
    if (!this.signsPoints.isReady()) await this.signsPoints.init();
    return this.signsPoints.get(session);
  }

  async placeSessionPoints(data: ISessionPoints) {
    this.signsPoints.place(data.currentSession, data);
    await this.signsPoints.save();
  }

  // // End Points Region

  // // Rating Region

  async getSessionRating(session: number) {
    if (!this.signsRating.isReady()) await this.signsRating.init();
    return this.signsRating.get(session);
  }

  async placeSessionRating(data: ISessionRating) {
    this.signsRating.place(data.session.current, data);
    await this.signsRating.save();
  }

  // // End Rating Region

  // End Signs Region

  // // Certificate Region

  async getCertificate(): Promise<ICertificateResult> {
    if (!this.certificate.isReady()) await this.certificate.init();
    return { certificates: this.certificate.get(), announce: {} };
  }

  async placeCertificate(data: ICertificateResult) {
    this.certificate.place(data.certificates);
    await this.certificate.save();
  }

  async placeOneCertificate(certificate: ICertificate) {
    if (!this.certificate.isReady()) await this.certificate.init();

    const certificates = this.certificate.get();
    certificates[certificates.findIndex((c) => c.id === certificate.id)] = certificate;

    this.placeCertificate({ certificates, announce: {} });
  }

  // // End Certificate Region

  // Student Region

  async getStudent() {
    if (!this.student.isReady()) await this.student.init();
    return this.student.get();
  }

  async placeStudent(data: StudentInfo) {
    this.student.place(data);

    await this.student.save();
  }

  async placePartialStudent(data: Partial<StudentInfo>) {
    const student = (await this.getStudent()) || ({} as StudentInfo);

    Object.entries(data).forEach(([key, value]) => {
      student[key] = value;
    });

    await this.placeStudent(student);
  }

  // End Student Region

  // Calendar Schedule region

  async getCalendarSchedule() {
    if (!this.calendarSchedule.isReady()) await this.calendarSchedule.init();
    return this.calendarSchedule.get();
  }

  async placeCalendarSchedule(data: ICalendarSchedule) {
    this.calendarSchedule.place(data);
    await this.calendarSchedule.save();
  }

  // End Calendar Schedule region

  // Cathedra Timetable region

  async placeCathedraTimetable(
    requestPayload: ICathedraTimetablePayload,
    data: ICathedraTimetable
  ) {
    await this.cathedraTimetable.init();
    // Данные на выходе сильно зависят от данных на входе, поэтому ничего не остаётся,
    // кроме как в лоб использовать payload в запросе
    this.cathedraTimetable.place(JSON.stringify(requestPayload), data);
    await this.cathedraTimetable.save();
  }

  async getCathedraTimetable(requestPayload: ICathedraTimetablePayload) {
    await this.cathedraTimetable.init();
    return this.cathedraTimetable.get(JSON.stringify(requestPayload));
  }

  // End Cathedra Timetable region

  // Group Timetable region

  async placeGroupTimetable(requestPayload: IGroupTimetablePayload, data: ITimeTable) {
    await this.groupTimetable.init();
    // Данные на выходе сильно зависят от данных на входе, поэтому ничего не остаётся,
    // кроме как в лоб использовать payload в запросе
    this.groupTimetable.place(JSON.stringify(requestPayload), data);
    await this.groupTimetable.save();
  }

  async getGroupTimetable(requestPayload: IGroupTimetablePayload) {
    await this.groupTimetable.init();
    return this.groupTimetable.get(JSON.stringify(requestPayload));
  }

  // End Group Timetable region

  // Secure Region

  async getUserCredentials() {
    if (!this.user.isReady()) await this.user.init();
    return this.user.get();
  }

  async placeUserCredentials(data: UserCredentials) {
    this.user.place(data);
    await this.user.save();
  }

  async deleteUserCredentials() {
    await this.user.delete();
  }

  // End Secure Region

  // Internal Region

  async getPersonalRecords() {
    if (!this.personalRecords.isReady()) await this.personalRecords.init();
    return this.personalRecords.get();
  }

  async placePersonalRecords(data: IPersonalRecord[]) {
    this.personalRecords.place(data);
    await this.personalRecords.save();
  }

  async getAppConfig() {
    if (!this.app.isReady()) await this.app.init();
    return this.app.get() || ({} as AppConfig);
  }

  async updateAppConfig(config: AppConfig) {
    await this.app.init();

    this.app.place(config);
    await this.app.save();
  }

  async getTheme() {
    const data = await this.getAppConfig();
    return data.theme;
  }

  async placeTheme(theme: ThemeType) {
    const config = await this.getAppConfig();
    config.theme = theme;
    await this.updateAppConfig(config);
  }

  async getSignNotification() {
    const data = await this.getAppConfig();
    return data.signNotificationEnabled;
  }

  async placeSignNotification(enabled: boolean) {
    const config = await this.getAppConfig();
    config.signNotificationEnabled = enabled;
    await this.updateAppConfig(config);
  }

  async getIntroViewed() {
    const data = await this.getAppConfig();
    return data.introViewed;
  }

  async placeIntroViewed(status: boolean) {
    const config = await this.getAppConfig();
    config.introViewed = status;
    await this.updateAppConfig(config);
  }

  async getReviewStep() {
    const data = await this.getAppConfig();
    return data.reviewStep;
  }

  async setReviewStep(step: 'pending' | 'stop') {
    const config = await this.getAppConfig();
    config.reviewStep = step;
    await this.updateAppConfig(config);
  }

  async bumpReviewRequest() {
    const step = await this.getReviewStep();

    if (!step) {
      await this.setReviewStep('pending');
      return false;
    }
    if (step === 'pending') {
      return true;
    }
  }

  async hasAcceptedPrivacyPolicy() {
    const config = await this.getAppConfig();
    return config.privacyPolicyAccepted;
  }

  async setPrivacyPolicyStatus(status: boolean) {
    const config = await this.getAppConfig();
    config.privacyPolicyAccepted = status;
    await this.updateAppConfig(config);
  }

  async getSentryEnabled() {
    const config = await this.getAppConfig();
    return config.sentryEnabled;
  }

  async setSentryEnabled(enabled: boolean) {
    const config = await this.getAppConfig();
    config.sentryEnabled = enabled;
    await this.updateAppConfig(config);
  }

  async getEvents() {
    const config = await this.getAppConfig();
    if (!config.events) {
      config.events = {};
      await this.updateAppConfig(config);
    }
    return config.events;
  }

  async placeEvents(events: Events) {
    const config = await this.getAppConfig();
    config.events = events;
    await this.updateAppConfig(config);
  }

  async setUIConfig(config: Partial<UIConfig>) {
    const appConfig = await this.getAppConfig();
    appConfig.ui = appConfig.ui ? { ...appConfig.ui, ...config } : ({ ...config } as UIConfig);
    await this.updateAppConfig(appConfig);
  }

  async setReleaseNotesViews(versionsInfo: { [version: string]: boolean }) {
    const appConfig = await this.getAppConfig();
    appConfig.releaseNotesViews = appConfig.releaseNotesViews
      ? { ...appConfig.releaseNotesViews, ...versionsInfo }
      : { ...versionsInfo };
    await this.updateAppConfig(appConfig);
  }

  async getAccountData() {
    await this.account.init();
    return this.account.get();
  }

  async clearAccountData() {
    await this.account.init();
    await this.account.delete();
  }

  async setTeacherData(teacher: TeacherState) {
    await this.account.init();
    this.account.place({ teacher });
    await this.account.save();
  }

  async setStudentData(student: UnauthorizedStudentState) {
    await this.account.init();
    this.account.place({ student });
    await this.account.save();
  }

  // End Internal Region

  // Helper methods

  async clear(clearUserData?: boolean) {
    await this.absences.clear();
    await this.announce.delete();
    await this.messages.clear();
    await this.orders.list.delete();
    await this.orders.info.clear();
    await this.personalRecords.delete();
    await this.timeTable.clear();
    await this.teachers.delete();
    await this.teachPlan.delete();
    await this.signsMarks.clear();
    await this.signsPoints.clear();
    await this.signsRating.clear();
    await this.student.delete();

    if (clearUserData) await this.user.delete();
  }

  // Legacy

  // TODO: Remove in the future
  async migrateLegacyUserCredentials(): Promise<UserCredentials> {
    const login = await SecureStore.getItemAsync('userLogin');

    if (!login) return null;

    const password = await SecureStore.getItemAsync('userPassword');
    const userCredentials = {
      login,
      password,
    };

    this.placeUserCredentials(userCredentials);
    SecureStore.deleteItemAsync('userLogin');
    SecureStore.deleteItemAsync('userPassword');

    return userCredentials;
  }

  runMigrations() {
    this.migrateToV1_3_0();
  }

  /*
  Изменились структуры некоторых данных (расписание)
  */
  private async migrateToV1_3_0() {
    const appConfig = await this.getAppConfig();
    if (!appConfig.cacheMigrations) {
      appConfig.cacheMigrations = {};
    }
    if (appConfig.cacheMigrations.v1_3_0) return;

    await this.clearTimeTable();
    await this.teachers.init();
    await this.teachers.delete();
    await this.teachers.save();

    appConfig.cacheMigrations.v1_3_0 = true;
    await this.updateAppConfig(appConfig);
  }
}

export const cache = new SmartCache();
cache.runMigrations();
