import { IAbsence, IGetAbsencesPayload } from '../models/absences';
import { ICalendarSchedule } from '../models/calendarSchedule';
import { ICertificateTable } from '../models/certificate';
import { IGetMessagesPayload, IMessagesData } from '../models/messages';
import { IOrder } from '../models/order';
import { IGetRatingPayload, ISessionRating } from '../models/rating';
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
import {
  IGetStringPayload,
  ISessionQuestionnaire,
  ISessionQuestionnaireLink,
} from '../models/sessionQuestionnaire';
import { IGetSignsPayload } from '../models/signs';
import { ISessionTeachPlan } from '../models/teachPlan';
import { TeacherType } from '../models/teachers';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { StudentInfo } from '../parser/menu';
import { isLoginPage } from '../parser/utils';
import { Response } from '../utils/http';
import { reportParserError } from '../utils/sentry';

export interface BaseClient {
  getAbsencesData(payload: IGetAbsencesPayload): Promise<IGetResult<IAbsence>>;
  getAnnounceData(payload: IGetPayload): Promise<IGetResult<string[]>>;
  getTimeTableData(payload: ITimeTableGetProps): Promise<IGetResult<ITimeTable>>;
  getMessagesData(payload: IGetMessagesPayload): Promise<IGetResult<IMessagesData>>;
  getOrdersData(payload: IGetPayload): Promise<IGetResult<IOrder[]>>;
  getRatingData(payload: IGetRatingPayload): Promise<IGetResult<ISessionRating>>;
  getSessionSignsData(payload: IGetSignsPayload): Promise<IGetResult<ISessionPoints>>;
  getSessionMarksData(payload: IGetPayload): Promise<IGetResult<ISessionMarks[]>>;
  getStudentInfoData(payload: IGetPayload): Promise<IGetResult<StudentInfo>>;
  getTeacherData(payload: IGetPayload): Promise<IGetResult<TeacherType>>;
  getTeachPlanData(payload: IGetPayload): Promise<IGetResult<ISessionTeachPlan[]>>;
  getCalendarScheduleData(payload: IGetPayload): Promise<IGetResult<ICalendarSchedule>>;
  getCertificateData(payload: IGetPayload): Promise<IGetResult<ICertificateTable>>;
  getSessionQuestionnaireList(
    payload: IGetStringPayload
  ): Promise<IGetResult<ISessionQuestionnaireLink[]>>;
  getSessionQuestionnaire(payload: IGetStringPayload): Promise<IGetResult<ISessionQuestionnaire>>;
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

  async tryFetch(payload: P): Promise<Response<string>> {
    return await this.httpMethod(payload);
  }

  /* применяется на сырых данных после tryFetch */
  async checkLoginPage({ data }: Response<string>): Promise<IGetResult<T>> {
    if (isLoginPage(data)) {
      return loginPageResult;
    }
  }

  async tryParse({ data }: Response<string>): Promise<IGetResult<T>> {
    let parsedData: T;
    try {
      parsedData = this.parseMethod(data);
    } catch (e) {
      console.warn(`[PARSER] Ignoring a error from ${this.name}`);
      console.trace(e);
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
    } else if (payload.requestType === RequestType.forceCache) {
      return errorResult;
    }
    const fetched = await this.tryFetch(payload);

    if (!fetched || fetched?.error) {
      if (payload.requestType === RequestType.forceFetch) {
        console.log(`[DATA] Failed to force retrieve ${this.name} from server`);
        return errorResult;
      }
      return await this.tryCached({ ...payload, requestType: RequestType.forceCache });
    }

    const loginPage = await this.checkLoginPage(fetched);
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
