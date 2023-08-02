import Cache from './cache';
import { httpClient } from '../utils';
import {
  errorResult,
  failedResult,
  GetResultType,
  IGetPayload,
  IGetResult,
} from '../models/results';
import { parseAnnounce, parseMessages, parseTimeTable } from '../parser';
import { BaseClient } from './base';
import { useMemo } from 'react';
import DemoClient from './demoClient';
import { useAppSelector } from '../hooks';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { IGetMessagesPayload, IMessagesData } from '../models/messages';

export const getWrappedClient: () => BaseClient = () => {
  const { isDemo } = useAppSelector((state) => state.auth);
  return useMemo(() => (isDemo ? new DemoClient() : new Client()), [isDemo]);
};

export default class Client implements BaseClient {
  public cache: Cache;

  constructor() {
    this.cache = new Cache();
  }

  async getAnnounceData(payload: IGetPayload): Promise<IGetResult<string[]>> {
    if (payload.forceCache) {
      const result = await this.cache.getAnnounceData();
      return result.data ? result : errorResult;
    }

    const response = await httpClient.getAnnounce();

    if (!response || response.error) {
      if (!payload.forceFetch) {
        return errorResult;
      }

      return await this.getAnnounceData({ ...payload, forceCache: true });
    }

    const data = parseAnnounce(response.data);
    if (!data) return failedResult;

    this.cache.placeAnnounceData(data);

    return {
      type: GetResultType.fetched,
      data,
    };
  }

  async getTimeTableData(payload: ITimeTableGetProps): Promise<IGetResult<ITimeTable>> {
    if (payload.forceCache) {
      const result = await this.cache.getTimeTableData(payload.week);
      return result.data ? result : errorResult;
    }

    let response;
    if (payload.week !== null) {
      response = await httpClient.getTimeTable({ week: payload.week });
    } else {
      response = await httpClient.getTimeTable();
    }

    if (!response || response.error) {
      return payload.forceFetch
        ? errorResult
        : await this.getTimeTableData({ ...payload, forceCache: true });
    }
    console.log(`[DATA] Fetched timetable for week ${payload.week}`);

    const data = parseTimeTable(response.data);

    this.cache.placeTimeTableData(data);

    return {
      data,
      type: GetResultType.fetched,
    };
  }

  async getMessagesData(payload: IGetMessagesPayload): Promise<IGetResult<IMessagesData>> {
    if (payload.forceCache) {
      const result = await this.cache.getCachedMessagesData(payload.page);
      return result.data ? result : errorResult;
    }

    const response = await httpClient.getMessages(payload.page);

    if (!response || response.error) {
      if (!payload.forceFetch) {
        return errorResult;
      }
      return await this.getMessagesData({ ...payload, forceCache: true });
    }

    const data = parseMessages(response.data);
    console.log(`[DATA] Fetched messages for ${data.page} page`);

    this.cache.placeMessagesData(data);

    return {
      type: GetResultType.fetched,
      data,
    };
  }
}
