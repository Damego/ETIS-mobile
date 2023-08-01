import Cache from './cache';
import { httpClient } from '../utils';
import {
  errorResult,
  failedResult,
  GetPayload,
  GetResultType,
  IGetResult,
} from '../models/results';
import { parseAnnounce } from '../parser';
import { BaseClient } from './base';
import { GetTimeTablePayload } from './types';
import { useMemo } from 'react';
import DemoClient from './demoClient';
import { useAppSelector } from '../hooks';

export const getWrappedClient = () => {
  const { isDemo } = useAppSelector((state) => state.auth);
  return useMemo(() => (isDemo ? new DemoClient() : new Client()), []);
};

export default class Client implements BaseClient {
  public cache: Cache;

  constructor() {
    this.cache = new Cache();
  }

  async getAnnounceData(payload: GetPayload): Promise<IGetResult<string[]>> {
    if (payload.forceCache) {
      return await this.cache.getAnnounceData();
    }

    const response = await httpClient.getAnnounce();

    if (response.error) {
      if (!payload.forceFetch) {
        return errorResult;
      }

      return await this.cache.getAnnounceData();
    }

    const data = parseAnnounce(response.data);

    if (!data) return failedResult;

    this.cache.placeAnnounceData(data);

    return {
      type: GetResultType.fetched,
      data,
    };
  }

  async getTimeTableData(payload: GetTimeTablePayload) {
    if (payload.forceCache) {
      return await this.cache.getTimeTableData(payload.week);
    }
  }
}
