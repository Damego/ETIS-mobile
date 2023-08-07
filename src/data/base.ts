import {
  errorResult,
  failedResult,
  GetResultType,
  IGetPayload,
  IGetResult,
  loginPageResult,
  RequestType,
} from '../models/results';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { IGetMessagesPayload, IMessagesData } from '../models/messages';
import { Response } from '../utils/http';
import { isLoginPage } from '../parser/utils';
import { IOrder } from '../models/order';
import { IGetRatingPayload, ISessionRating } from '../models/rating';
import { ISessionMarks } from '../models/sessionMarks';
import { IGetSignsPayload } from '../models/signs';
import { MenuParseResult } from '../parser/menu';
import { TeacherType } from '../models/teachers';
import { ISessionTeachPlan } from '../models/teachPlan';
import { ISessionPoints } from '../models/sessionPoints';

export interface BaseClient {
  getAnnounceData(payload: IGetPayload): Promise<IGetResult<string[]>>;
  getTimeTableData(payload: ITimeTableGetProps): Promise<IGetResult<ITimeTable>>;
  getMessagesData(payload: IGetMessagesPayload): Promise<IGetResult<IMessagesData>>;
  getOrdersData(payload: IGetPayload): Promise<IGetResult<IOrder[]>>;
  getRatingData(payload: IGetRatingPayload): Promise<IGetResult<ISessionRating>>;
  getSessionSignsData(payload: IGetSignsPayload): Promise<IGetResult<ISessionPoints>>;
  getSessionMarksData(payload: IGetPayload): Promise<IGetResult<ISessionMarks[]>>;
  getStudentInfoData(payload: IGetPayload): Promise<IGetResult<MenuParseResult>>;
  getTeacherData(payload: IGetPayload): Promise<IGetResult<TeacherType>>;
  getTeachPlanData(payload: IGetPayload): Promise<IGetResult<ISessionTeachPlan[]>>;
}

export class BasicClient<P extends IGetPayload, T> {
  cacheMethod: (payload?: P) => Promise<IGetResult<T>>;
  fetchMethod: (payload?: P) => Promise<Response<string>>;
  parseMethod: (data: string) => T;
  placeMethod: (data: T) => void;
  name: string;

  constructor(
    cacheMethod: (payload?: P) => Promise<IGetResult<T>>,
    fetchMethod: (payload?: P) => Promise<Response<string>>,
    parseMethod: (data: string) => T,
    placeMethod: (data: T) => void
  ) {
    this.cacheMethod = cacheMethod;
    this.fetchMethod = fetchMethod;
    this.parseMethod = parseMethod;
    this.placeMethod = placeMethod;
    this.name = this.constructor.name.split('Client')[0];
  }

  async tryCached(payload: P): Promise<IGetResult<T>> | null {
    if (
      payload.requestType === RequestType.forceCache ||
      payload.requestType === RequestType.tryCache
    ) {
      const result = await this.cacheMethod(payload);
      return result.data || payload.requestType === RequestType.tryCache ? result : errorResult;
    }
  }

  async tryFetch(payload: P): Promise<Response<string>> {
    return await this.fetchMethod(payload);
  }

  /* применяется на сырых данных после tryFetch */
  async checkLoginPage({ data }: Response<string>): Promise<IGetResult<T>> {
    if (isLoginPage(data)) {
      return loginPageResult;
    }
  }

  async tryParse({ data }: Response<string>): Promise<IGetResult<T>> {
    const parsedData = this.parseMethod(data);
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
