import Cache from './cache';
import { httpClient } from '../utils';
import { IGetPayload, IGetResult } from '../models/results';
import {
  parseAnnounce,
  parseMessages,
  parseSessionMarks,
  parseSessionPoints,
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
import { IGetRatingPayload, IRating } from '../models/rating';
import parseRating from '../parser/rating';
import { ISessionSignsData } from '../models/sessionPoints';
import { IGetSignsPayload } from '../models/signs';
import { ISessionMarks } from '../models/sessionMarks';

export const getWrappedClient: () => BaseClient = () => {
  const { isDemo } = useAppSelector((state) => state.auth);
  return useMemo(() => (isDemo ? new DemoClient() : new Client()), [isDemo]);
};

class AnnounceClient extends BasicClient<IGetPayload, string[]> {}
class TimeTableClient extends BasicClient<ITimeTableGetProps, ITimeTable> {
  async tryFetch(payload: ITimeTableGetProps): Promise<Response<string>> {
    if (payload.week !== null) {
      return await httpClient.getTimeTable({ week: payload.week });
    } else {
      return await httpClient.getTimeTable();
    }
  }
}
class MessageClient extends BasicClient<IGetMessagesPayload, IMessagesData> {}
class OrderClient extends BasicClient<IGetPayload, IOrder[]> {}
class RatingClient extends BasicClient<IGetRatingPayload, IRating> {}
class SignsClient extends BasicClient<IGetSignsPayload, ISessionSignsData> {}
class MarksClient extends BasicClient<IGetPayload, ISessionMarks[]> {}

export default class Client implements BaseClient {
  private cache: Cache;
  private announceClient: AnnounceClient;
  private timeTableClient: TimeTableClient;
  private messageClient: MessageClient;
  private orderClient: OrderClient;
  private ratingClient: RatingClient;
  private signsClient: SignsClient;
  private marksClient: MarksClient;

  constructor() {
    this.cache = new Cache();
    this.announceClient = new AnnounceClient(
      this.cache.getAnnounceData,
      () => httpClient.getAnnounce(), // need bind http client order to httpClient is class
      parseAnnounce,
      this.cache.placeAnnounceData
    );
    this.timeTableClient = new TimeTableClient(
      ({ week }) => this.cache.getTimeTableData(week),
      () => httpClient.getTimeTable(),
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

  async getRatingData(payload: IGetRatingPayload): Promise<IGetResult<IRating>> {
    return this.ratingClient.getData(payload);
  }
  async getSessionSignsData(payload: IGetSignsPayload): Promise<IGetResult<ISessionSignsData>> {
    return this.signsClient.getData(payload);
  }
  async getSessionMarksData(payload: IGetPayload): Promise<IGetResult<ISessionMarks[]>> {
    return this.marksClient.getData(payload);
  }
}
