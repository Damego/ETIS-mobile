import { useMemo } from 'react';

import { cache } from '../cache/smartCache';
import { useAppSelector } from '../hooks';
import { ICalendarSchedule } from '../models/calendarSchedule';
import { ICertificateTable } from '../models/certificate';
import { IGetMessagesPayload, IMessagesData } from '../models/messages';
import { IOrder } from '../models/order';
import { IGetRatingPayload, ISessionRating } from '../models/rating';
import {
  GetResultType,
  IGetPayload,
  IGetResult,
  errorResult,
  loginPageResult,
} from '../models/results';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';
import { ISessionQuestionnaire, ISessionQuestionnaireLink } from '../models/sessionQuestionnaire';
import { IGetSignsPayload } from '../models/signs';
import { ISessionTeachPlan } from '../models/teachPlan';
import { TeacherType } from '../models/teachers';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import {
  parseAnnounce,
  parseMenu,
  parseMessages,
  parseSessionMarks,
  parseSessionPoints,
  parseShortTeachPlan,
  parseTeachers,
  parseTimeTable,
} from '../parser';
import { parseCertificateTable } from '../parser/certificate';
import parseCalendarSchedule from '../parser/calendar';
import { StudentInfo } from '../parser/menu';
import parseOrders from '../parser/order';
import parseRating from '../parser/rating';
import parseSessionQuestionnaire from '../parser/sessionQuestionnaire';
import parseSessionQuestionnaireList from '../parser/sessionQuestionnaireList';
import { isLoginPage } from '../parser/utils';
import { httpClient } from '../utils';
import { BaseClient, BasicClient } from './base';
import DemoClient from './demoClient';

export const getWrappedClient: () => BaseClient = () => {
  const { isDemo } = useAppSelector((state) => state.auth);
  return useMemo(() => (isDemo ? new DemoClient() : new Client()), [isDemo]);
};

class AnnounceClient extends BasicClient<IGetPayload, string[]> {}
class TimeTableClient extends BasicClient<ITimeTableGetProps, ITimeTable> {}
class MessageClient extends BasicClient<IGetMessagesPayload, IMessagesData> {}
class OrderClient extends BasicClient<IGetPayload, IOrder[]> {}
class RatingClient extends BasicClient<IGetRatingPayload, ISessionRating> {}
class SignsClient extends BasicClient<IGetSignsPayload, ISessionPoints> {}
class MarksClient extends BasicClient<IGetPayload, ISessionMarks[]> {}
class StudentClient extends BasicClient<IGetPayload, StudentInfo> {}
class TeachersClient extends BasicClient<IGetPayload, TeacherType> {}
class TeachPlanClient extends BasicClient<IGetPayload, ISessionTeachPlan[]> {}
class CalendarScheduleClient extends BasicClient<IGetPayload, ICalendarSchedule> {}
class CertificateClient extends BasicClient<IGetPayload, ICertificateTable> {}
export default class Client implements BaseClient {
  private announceClient: AnnounceClient;
  private timeTableClient: TimeTableClient;
  private messageClient: MessageClient;
  private orderClient: OrderClient;
  private ratingClient: RatingClient;
  private signsClient: SignsClient;
  private marksClient: MarksClient;
  private studentClient: StudentClient;
  private teacherClient: TeachersClient;
  private teachPlanClient: TeachPlanClient;
  private calendarScheduleClient: CalendarScheduleClient;
  private certificateClient: CertificateClient;

  constructor() {
    this.announceClient = new AnnounceClient(
      () => cache.getAnnounce(),
      () => httpClient.getAnnounce(),
      parseAnnounce,
      (data) => cache.placeAnnounce(data)
    );
    this.timeTableClient = new TimeTableClient(
      ({ week }) => cache.getTimeTable(week),
      ({ week }) => httpClient.getTimeTable({ week }),
      parseTimeTable,
      (data) => cache.placeTimeTable(data)
    );
    this.messageClient = new MessageClient(
      ({ page }) => cache.getMessages(page),
      ({ page }) => httpClient.getMessages(page),
      parseMessages,
      (data) => cache.placeMessages(data)
    );
    this.orderClient = new OrderClient(
      () => cache.getOrders(),
      () => httpClient.getOrders(),
      parseOrders,
      (data) => cache.placeOrders(data)
    );
    this.ratingClient = new RatingClient(
      ({ session }) => cache.getSessionRating(session),
      ({ session }) => httpClient.getSigns('rating', session),
      parseRating,
      (data) => cache.placeSessionRating(data)
    );
    this.signsClient = new SignsClient(
      ({ session }) => cache.getSessionPoints(session),
      ({ session }) => httpClient.getSigns('current', session),
      parseSessionPoints,
      (data) => cache.placeSessionPoints(data)
    );
    this.marksClient = new MarksClient(
      () => cache.getAllSessionMarks(),
      () => httpClient.getSigns('session'),
      parseSessionMarks,
      (data) => cache.placeSessionMarks(data)
    );
    this.studentClient = new StudentClient(
      () => cache.getStudent(),
      () => httpClient.getGroupJournal(),
      (payload) => parseMenu(payload, true),
      (data) => cache.placeStudent(data)
    );
    this.teacherClient = new TeachersClient(
      () => cache.getTeachers(),
      () => httpClient.getTeachers(),
      parseTeachers,
      (data) => cache.placeTeachers(data)
    );
    this.teachPlanClient = new TeachPlanClient(
      () => cache.getTeachPlan(),
      () => httpClient.getTeachPlan(),
      parseShortTeachPlan,
      (data) => cache.placeTeachPlan(data)
    );
    this.calendarScheduleClient = new CalendarScheduleClient(
      () => cache.getCalendarSchedule(),
      () => httpClient.getTeachPlan('advanced'),
      parseCalendarSchedule,
      (data) => cache.placeCalendarSchedule(data)
    );
    this.certificateClient = new CertificateClient(
      () => cache.getCertificate(),
      () => httpClient.getCertificate(),
      parseCertificateTable,
      (data) => cache.placeCertificate(data)
    );
  }

  async getAnnounceData(payload: IGetPayload): Promise<IGetResult<string[]>> {
    await cache.announce.init();
    return this.announceClient.getData(payload);
  }

  async getTimeTableData(payload: ITimeTableGetProps): Promise<IGetResult<ITimeTable>> {
    await cache.timeTable.init();
    return this.timeTableClient.getData(payload);
  }

  async getMessagesData(payload: IGetMessagesPayload): Promise<IGetResult<IMessagesData>> {
    await cache.messages.init();
    return this.messageClient.getData(payload);
  }

  async getOrdersData(payload: IGetPayload): Promise<IGetResult<IOrder[]>> {
    await cache.orders.list.init();
    return this.orderClient.getData(payload);
  }

  async getRatingData(payload: IGetRatingPayload): Promise<IGetResult<ISessionRating>> {
    await cache.signsRating.init();
    return this.ratingClient.getData(payload);
  }

  async getSessionSignsData(payload: IGetSignsPayload): Promise<IGetResult<ISessionPoints>> {
    await cache.signsPoints.init();
    return this.signsClient.getData(payload);
  }

  async getSessionMarksData(payload: IGetPayload): Promise<IGetResult<ISessionMarks[]>> {
    await cache.signsMarks.init();
    return this.marksClient.getData(payload);
  }

  async getStudentInfoData(payload: IGetPayload): Promise<IGetResult<StudentInfo>> {
    await cache.student.init();
    return this.studentClient.getData(payload);
  }

  async getTeacherData(payload: IGetPayload): Promise<IGetResult<TeacherType>> {
    await cache.teachers.init();
    return this.teacherClient.getData(payload);
  }

  async getTeachPlanData(payload: IGetPayload): Promise<IGetResult<ISessionTeachPlan[]>> {
    await cache.teachPlan.init();
    return this.teachPlanClient.getData(payload);
  }

  async getCalendarScheduleData(payload: IGetPayload): Promise<IGetResult<ICalendarSchedule>> {
    await cache.calendarSchedule.init();
    return this.calendarScheduleClient.getData(payload);
  }
  async getCertificateData(payload: IGetPayload): Promise<IGetResult<ICertificateTable>> {
    await cache.certificate.init();
    return this.certificateClient.getData(payload);
  }

  async getSessionQuestionnaireList(id: string): Promise<IGetResult<ISessionQuestionnaireLink[]>> {
    // sry Aleksandr :D

    const response = await httpClient.getSessionQuestionnaireList(id);

    if (response?.error) return errorResult;
    if (isLoginPage(response.data)) return loginPageResult;

    const parsed = parseSessionQuestionnaireList(response.data);
    return {
      type: GetResultType.fetched,
      data: parsed,
    };
  }

  async getSessionQuestionnaire(url: string): Promise<IGetResult<ISessionQuestionnaire>> {
    // sry Aleksandr :D

    const response = await httpClient.request('GET', url, { returnResponse: false });

    if (response?.error) return errorResult;
    if (isLoginPage(response.data)) return loginPageResult;

    const parsed = parseSessionQuestionnaire(response.data);
    return {
      type: GetResultType.fetched,
      data: parsed,
    };
  }
}
