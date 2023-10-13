import { IAbsence } from '../models/absences';
import { ICalendarSchedule } from '../models/calendarSchedule';
import { ICathedraTimetable, ICathedraTimetablePayload } from '../models/cathedraTimetable';
import { ICertificateTable } from '../models/certificate';
import { IMessagesData } from '../models/messages';
import { IOrder } from '../models/order';
import { IPersonalRecord } from '../models/personalRecords';
import { ISessionRating } from '../models/rating';
import {
  GetResultType,
  IGetPayload,
  IGetResult,
  RequestType,
  errorResult,
  failedResult,
  loginPageResult,
} from '../models/results';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';
import { ISessionQuestionnaire, ISessionQuestionnaireLink } from '../models/sessionQuestionnaire';
import { ISessionTeachPlan } from '../models/teachPlan';
import { TeacherType } from '../models/teachers';
import { ITimeTable } from '../models/timeTable';
import { StudentInfo } from '../parser/menu';
import { isLoginPage } from '../parser/utils';
import { Response } from '../utils/http';
import { reportParserError } from '../utils/sentry';

export interface BaseClient {
  getAbsencesData(payload: IGetPayload<number>): Promise<IGetResult<IAbsence>>;
  getAnnounceData(payload: IGetPayload): Promise<IGetResult<string[]>>;
  getTimeTableData(payload: IGetPayload<number>): Promise<IGetResult<ITimeTable>>;
  getMessagesData(payload: IGetPayload<number>): Promise<IGetResult<IMessagesData>>;
  getOrdersData(payload: IGetPayload): Promise<IGetResult<IOrder[]>>;
  getRatingData(payload: IGetPayload<number>): Promise<IGetResult<ISessionRating>>;
  getSessionSignsData(payload: IGetPayload<number>): Promise<IGetResult<ISessionPoints>>;
  getSessionMarksData(payload: IGetPayload): Promise<IGetResult<ISessionMarks[]>>;
  getStudentInfoData(payload: IGetPayload): Promise<IGetResult<StudentInfo>>;
  getTeacherData(payload: IGetPayload): Promise<IGetResult<TeacherType>>;
  getTeachPlanData(payload: IGetPayload): Promise<IGetResult<ISessionTeachPlan[]>>;
  getCalendarScheduleData(payload: IGetPayload): Promise<IGetResult<ICalendarSchedule>>;
  getCertificateData(payload: IGetPayload): Promise<IGetResult<ICertificateTable>>;
  getSessionQuestionnaireList(
    payload: IGetPayload<string>
  ): Promise<IGetResult<ISessionQuestionnaireLink[]>>;
  getSessionQuestionnaire(payload: IGetPayload<string>): Promise<IGetResult<ISessionQuestionnaire>>;
  getPersonalRecords(payload: IGetPayload): Promise<IGetResult<IPersonalRecord[]>>;
  getCathedraTimetable(
    payload: IGetPayload<ICathedraTimetablePayload>
  ): Promise<IGetResult<ICathedraTimetable>>;
}

export class BasicClient<P extends IGetPayload, T> {
  cacheMethod: (payload?: P) => Promise<T>;
  httpMethod: (payload?: P) => Promise<Response<string>>;
  parseMethod: (data: string) => T;
  placeMethod: (data: T) => void;
  name: string;

  constructor(
    cacheMethod: (payload?: P) => Promise<T>,
    httpMethod: (payload?: P) => Promise<Response<string>>,
    parseMethod: (data: string) => T,
    placeMethod: (data: T) => void
  ) {
    this.cacheMethod = cacheMethod;
    this.httpMethod = httpMethod;
    this.parseMethod = parseMethod;
    this.placeMethod = placeMethod;
    // eslint-disable-next-line prefer-destructuring
    this.name = this.constructor.name.split('Client')[0];
  }

  async tryCached(payload: P): Promise<IGetResult<T>> | null {
    if (
      payload.requestType === RequestType.forceCache ||
      payload.requestType === RequestType.tryCache
    ) {
      const cached = await this.cacheMethod(payload);

      return cached || payload.requestType === RequestType.tryCache
        ? { data: cached, type: GetResultType.cached }
        : errorResult;
    }
  }

  tryFetch(payload: P): Promise<Response<string>> {
    return this.httpMethod(payload);
  }

  /* применяется на сырых данных после tryFetch */
  checkLoginPage({ data }: Response<string>): IGetResult<T> {
    if (isLoginPage(data)) {
      return loginPageResult;
    }
  }

  async tryParse({ data }: Response<string>): Promise<IGetResult<T>> {
    let parsedData: T;
    try {
      parsedData = this.parseMethod(data);
    } catch (e) {
      console.error(`[PARSER] Ignoring an error from ${this.name}`, e.stack || e);
      reportParserError(e);
    }
    if (!parsedData) return failedResult;

    return {
      data: parsedData,
      type: GetResultType.fetched,
    };
  }

  async getData(payload: P): Promise<IGetResult<T>> {
    console.log(`[DATA] Try retrieve ${this.name}`);
    const cached: IGetResult<T> = await this.tryCached(payload);
    if (cached?.data) {
      console.log(`[DATA] Retrieved ${this.name} from cache`);
      return cached;
    }
    if (payload.requestType === RequestType.forceCache) {
      return errorResult;
    }
    const fetched = await this.tryFetch(payload);

    if (!fetched || fetched?.error) {
      if (payload.requestType === RequestType.forceFetch) {
        console.log(`[DATA] Failed to force retrieve ${this.name} from server`);
        return errorResult;
      }
      return this.tryCached({ ...payload, requestType: RequestType.forceCache });
    }

    const loginPage = this.checkLoginPage(fetched);
    if (loginPage) {
      console.log(`[DATA] Retrieved ${this.name} from server, but it's login page`);
      return loginPage;
    }
    const parsed = await this.tryParse(fetched);
    if (parsed === failedResult) {
      console.log(`[DATA] Retrieved ${this.name} from server, but failed to parse`);
      return parsed;
    }

    this.placeMethod(parsed.data);
    console.log(`[DATA] Retrieved and cached ${this.name} from server`);
    return parsed;
  }
}
