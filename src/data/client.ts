import Cache from './cache';
import { httpClient } from '../utils';
import { IGetPayload, IGetResult } from '../models/results';
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
import { BaseClient, BasicClient } from './base';
import { useMemo } from 'react';
import DemoClient from './demoClient';
import { useAppSelector } from '../hooks';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { IGetMessagesPayload, IMessagesData } from '../models/messages';
import { Response } from '../utils/http';
import { IOrder } from '../models/order';
import parseOrders from '../parser/order';
import { IGetRatingPayload, ISessionRating } from '../models/rating';
import parseRating from '../parser/rating';
import { IGetSignsPayload } from '../models/signs';
import { ISessionMarks } from '../models/sessionMarks';
import { MenuParseResult } from '../parser/menu';
import { TeacherType } from '../models/teachers';
import { ISessionTeachPlan } from '../models/teachPlan';
import { ISessionPoints } from '../models/sessionPoints';

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
class StudentClient extends BasicClient<IGetPayload, MenuParseResult> {}
class TeachersClient extends BasicClient<IGetPayload, TeacherType> {}
class TeachPlanClient extends BasicClient<IGetPayload, ISessionTeachPlan[]> {}
export default class Client implements BaseClient {
  private readonly cache: Cache;
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

  constructor() {
    this.cache = new Cache();
    this.announceClient = new AnnounceClient(
      this.cache.getAnnounceData,
      () => httpClient.getAnnounce(),
      parseAnnounce,
      this.cache.placeAnnounceData
    );
    this.timeTableClient = new TimeTableClient(
      ({ week }) => this.cache.getTimeTableData(week),
      ({ week }) => httpClient.getTimeTable({ week }),
      parseTimeTable,
      this.cache.placeTimeTableData
    );
    this.messageClient = new MessageClient(
      ({ page }) => this.cache.getMessagesData(page),
      ({ page }) => httpClient.getMessages(page),
      parseMessages,
      this.cache.placeMessagesData
    );
    this.orderClient = new OrderClient(
      this.cache.getOrderData,
      () => httpClient.getOrders(),
      parseOrders,
      this.cache.placeOrderData
    );
    this.ratingClient = new RatingClient(
      ({ session }) => this.cache.getRatingData(session),
      () => httpClient.getSigns('rating'),
      parseRating,
      this.cache.placeRatingData
    );
    this.signsClient = new SignsClient(
      ({ session }) => this.cache.getSignsData(session),
      ({ session }) => httpClient.getSigns('current', session),
      parseSessionPoints,
      this.cache.placeSignsData
    );
    this.marksClient = new MarksClient(
      this.cache.getMarksData,
      () => httpClient.getSigns('session'),
      (data) => parseSessionMarks(data),
      this.cache.placeMarksData
    );
    this.studentClient = new StudentClient(
      this.cache.getStudentData,
      () => httpClient.getGroupJournal(),
      (payload) => parseMenu(payload, true),
      ({ studentInfo }) => this.cache.placeStudentData(studentInfo)
    );
    this.teacherClient = new TeachersClient(
      this.cache.getTeacherData,
      () => httpClient.getTeachers(),
      parseTeachers,
      this.cache.placeTeacherData
    );
    this.teachPlanClient = new TeachPlanClient(
      this.cache.getTeachPlanData,
      () => httpClient.getTeachPlan(),
      parseShortTeachPlan,
      this.cache.placeTeachPlanData
    );
  }
  async getAnnounceData(payload: IGetPayload): Promise<IGetResult<string[]>> {
    return this.announceClient.getData(payload);
  }

  async getTimeTableData(payload: ITimeTableGetProps): Promise<IGetResult<ITimeTable>> {
    return this.timeTableClient.getData(payload);
  }

  async getMessagesData(payload: IGetMessagesPayload): Promise<IGetResult<IMessagesData>> {
    return this.messageClient.getData(payload);
  }

  async getOrdersData(payload: IGetPayload): Promise<IGetResult<IOrder[]>> {
    return this.orderClient.getData(payload);
  }

  async getRatingData(payload: IGetRatingPayload): Promise<IGetResult<ISessionRating>> {
    return this.ratingClient.getData(payload);
  }
  async getSessionSignsData(payload: IGetSignsPayload): Promise<IGetResult<ISessionPoints>> {
    return this.signsClient.getData(payload);
  }
  async getSessionMarksData(payload: IGetPayload): Promise<IGetResult<ISessionMarks[]>> {
    return this.marksClient.getData(payload);
  }
  async getStudentInfoData(payload: IGetPayload): Promise<IGetResult<MenuParseResult>> {
    return this.studentClient.getData(payload);
  }
  async getTeacherData(payload: IGetPayload): Promise<IGetResult<TeacherType>> {
    return this.teacherClient.getData(payload);
  }
  async getTeachPlanData(payload: IGetPayload): Promise<IGetResult<ISessionTeachPlan[]>> {
    return this.teachPlanClient.getData(payload);
  }
}
