import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { IAbsence } from '../models/absences';
import { ICalendarSchedule } from '../models/calendarSchedule';
import { ICertificate, ICertificateTable } from '../models/certificate';
import { IMessagesData } from '../models/messages';
import { IOrder } from '../models/order';
import { IPersonalRecord } from '../models/personalRecords';
import { ISessionRating } from '../models/rating';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';
import { ISessionTeachPlan } from '../models/teachPlan';
import { TeacherType } from '../models/teachers';
import { ITimeTable } from '../models/timeTable';
import { OptionalStudentInfo, StudentInfo } from '../parser/menu';
import { UserCredentials } from '../redux/reducers/authSlice';
import { AppConfig, ThemeType } from '../redux/reducers/settingsSlice';
import FieldCache from './fieldCache';
import MappedCache from './mappedCache';
import SecuredFieldCache from './securedFieldCache';

export default class SmartCache {
  currentPersonalRecordIndex: number;

  absences: MappedCache<number, IAbsence>;
  announce: FieldCache<string[]>;
  messages: MappedCache<number, IMessagesData>;
  orders: {
    list: FieldCache<IOrder[]>;
    info: MappedCache<string, string>;
  };
  timeTable: MappedCache<number, ITimeTable>;
  teachers: FieldCache<TeacherType>;
  teachPlan: FieldCache<ISessionTeachPlan[]>;
  signsMarks: MappedCache<number, ISessionMarks>;
  signsPoints: MappedCache<number, ISessionPoints>;
  signsRating: MappedCache<number, ISessionRating>;
  student: FieldCache<StudentInfo>;
  calendarSchedule: FieldCache<ICalendarSchedule>;
  certificate: FieldCache<ICertificate[]>;

  // Internal
  personalRecords: FieldCache<IPersonalRecord[]>;
  user: SecuredFieldCache<UserCredentials>;
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
    SIGNS_POINTS: 'SIGNS_POINTS',
    SIGNS_MARKS: 'SIGNS_MARKS',
    SIGNS_RATING: 'SIGNS_RATING',
    STUDENT: 'STUDENT',
    TEACH_PLAN: 'TEACH_PLAN',
    TEACHERS: 'TEACHERS',
    TIMETABLE: 'TIMETABLE',

    // Internal keys
    USER: 'USER',
    APP: 'APP',
  };

  private generalKeys = [
    this.keys.APP,
    this.keys.USER,
    this.keys.ANNOUNCES,
    this.keys.MESSAGES,
    this.keys.PERSONAL_RECORDS,
  ];

  private bindRecordKeys = [
    ...Object.values(this.keys).filter((key) => !this.generalKeys.includes(key)),
  ];

  constructor() {
    this.announce = new FieldCache(this.keys.ANNOUNCES);
    this.messages = new MappedCache<number, IMessagesData>(this.keys.MESSAGES);
    this.personalRecords = new FieldCache(this.keys.PERSONAL_RECORDS);

    this.user = new SecuredFieldCache<UserCredentials>(this.keys.USER);
    this.app = new FieldCache<AppConfig>(this.keys.APP);
  }

  buildKey(key: string) {
    return `PR-${this.currentPersonalRecordIndex}::${key}`;
  }

  async init(personalRecordIndex: number, personalRecordsCount: number) {
    // Кэш зависит от текущей учётной записи студента
    // Сделано это ради того, чтобы не было коллизий с другими записями при сменах,
    // и при этом не очищать кэш при переходе из одной записи в другую.
    // Однако, коллизии всё равно могут быть, если сменить запись на сайте, и при этом пользоваться приложением,
    // но мы с этим ничего не сможем сделать
    this.currentPersonalRecordIndex = personalRecordIndex;

    await this.migrateToV120(personalRecordsCount);

    this.absences = new MappedCache<number, IAbsence>(this.keys.ABSENCES);
    this.orders = {
      list: new FieldCache<IOrder[]>(this.buildKey(this.keys.ORDERS)),
      info: new MappedCache<string, string>(this.buildKey(this.keys.ORDERS_INFO)),
    };
    this.timeTable = new MappedCache(this.buildKey(this.keys.TIMETABLE));
    this.teachers = new FieldCache<TeacherType>(this.buildKey(this.keys.TEACHERS));
    this.teachPlan = new FieldCache(this.buildKey(this.keys.TEACH_PLAN));
    this.signsMarks = new MappedCache(this.buildKey(this.keys.SIGNS_MARKS));
    this.signsPoints = new MappedCache(this.buildKey(this.keys.SIGNS_POINTS));
    this.signsRating = new MappedCache(this.buildKey(this.keys.SIGNS_RATING));
    this.student = new FieldCache<StudentInfo>(this.buildKey(this.keys.STUDENT));
    this.calendarSchedule = new FieldCache(this.buildKey(this.keys.CALENDAR_SCHEDULE));
    this.certificate = new FieldCache(this.buildKey(this.keys.CERTIFICATE));
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

  async placeAnnounce(data: string[]) {
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

  async deleteTimeTable(week: number) {
    this.timeTable.delete(week);
    await this.timeTable.save();
  }

  hasTimeTableWeek(week: number) {
    return this.timeTable.isReady() && this.timeTable.get(week) !== undefined;
  }

  // End TimeTable region

  // Teachers Region

  async getTeachers() {
    if (!this.teachers.isReady()) await this.teachers.init();
    return this.teachers.get();
  }

  async placeTeachers(data: TeacherType) {
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
    data.every((d) => {
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

  async getCertificate(): Promise<ICertificateTable> {
    if (!this.certificate.isReady()) await this.certificate.init();
    return { certificates: this.certificate.get(), announce: {} };
  }

  async placeCertificate(data: ICertificateTable) {
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

  async placePartialStudent(data: OptionalStudentInfo) {
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

    const currentPersonalRecord = data[data.findIndex((record) => !record.id)];
    await this.init(currentPersonalRecord.index, data.length);
  }

  async getAppConfig() {
    if (!this.app.isReady()) await this.app.init();
    return this.app.get() || ({} as AppConfig);
  }

  async getTheme() {
    const data = await this.getAppConfig();
    return data.theme;
  }

  async placeTheme(theme: ThemeType) {
    const data = await this.getAppConfig();
    data.theme = theme;
    this.app.place(data);
    await this.app.save();
  }

  async getSignNotification() {
    const data = await this.getAppConfig();
    return data.signNotificationEnabled;
  }

  async placeSignNotification(enabled: boolean) {
    const data = await this.getAppConfig();
    data.signNotificationEnabled = enabled;
    this.app.place(data);
    await this.app.save();
  }

  async getIntroViewed() {
    const data = await this.getAppConfig();
    return data.introViewed;
  }

  async placeIntroViewed(status: boolean) {
    const data = await this.getAppConfig();
    data.introViewed = status;
    this.app.place(data);
    await this.app.save();
  }

  async getReviewStep() {
    const data = await this.getAppConfig();
    return data.reviewStep;
  }

  async setReviewStep(step: 'pending' | 'stop') {
    const config = await this.getAppConfig();
    config.reviewStep = step;
    this.app.place(config);
    await this.app.save();
  }

  async bumpReviewRequest() {
    const step = await this.getReviewStep();

    if (!step) {
      await this.setReviewStep('pending');
      return false;
    } else if (step === 'pending') {
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
    this.app.place(config);
    await this.app.save();
  }

  async placeCacheV120Migrated() {
    const config = await this.getAppConfig();
    config.cacheV120Migrated = true;
    this.app.place(config);
    await this.app.save();
  }

  // End Internal Region

  // Helper methods

  async clear() {
    const personalRecords = await cache.getPersonalRecords();

    for (const record of personalRecords) {
      this.currentPersonalRecordIndex = record.index;
      const keys = this.bindRecordKeys.map((key) => this.buildKey(key));
      await AsyncStorage.multiRemove(keys);
    }
    await AsyncStorage.removeItem(this.keys.USER);
    await AsyncStorage.multiRemove(this.generalKeys.filter(key => key !== this.keys.APP));

    this.absences = null;
    this.announce = null;
    this.messages = null;
    this.orders.list = null;
    this.orders.info = null;
    this.timeTable = null;
    this.teachers = null;
    this.teachPlan = null;
    this.signsMarks = null;
    this.signsPoints = null;
    this.signsRating = null;
    this.student = null;
    this.user = null;
    this.certificate = null;
    this.personalRecords = null;
    this.calendarSchedule = null;
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

  /*
   * Делает миграцию кэша с v1.1.X до v.1.2.0
   */
  async migrateToV120(personalRecordsCount: number) {
    const app = await this.getAppConfig();
    if (app.cacheV120Migrated) return;

    console.log('[CACHE] Migrating to v1.2.0...');

    // Мы не знаем, к какой личной записи принадлежат ранее кэшированные данные
    // поэтому удаляем их, чтобы не было коллизий
    // А если запись одна, то просто переносим все данные под новые ключи
    if (personalRecordsCount === 1) {
      const data = await AsyncStorage.multiGet(this.bindRecordKeys);
      const updated: [string, string][] = data.map(([key, value]) => [this.buildKey(key), value]);
      await AsyncStorage.multiSet(updated);
    }
    await AsyncStorage.multiRemove(this.bindRecordKeys);
    await this.placeCacheV120Migrated();

    console.log('[CACHE] Successfully migrated');
  }
}

export const cache = new SmartCache();
