import { IGetPayload, IGetResult, emptyResult } from '../models/results';
import { parseAnnounce } from '../parser';
import { isLoginPage } from '../parser/utils';
import { httpClient, storage } from '../utils';
import { HTTPError } from '../utils/http';

export const getCachedAnnounceData = async () => {
  console.log('[DATA] Using cached announce data');

  return {
    ...emptyResult,
    data: await storage.getAnnounceData(),
  };
};

export const getAnnounceData = async (payload: IGetPayload): Promise<IGetResult<string[]>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedAnnounceData();
    if (result.data) return result;
  }

  const response = await httpClient.getAnnounce();

  if (response.error || !response) {
    if (!payload.useCache) return emptyResult;
    return await getCachedAnnounceData();
  }

  if (isLoginPage(response.data)) {
    return { ...emptyResult, isLoginPage: true };
  }

  console.log('[DATA] Fetched announce data');

  const data = parseAnnounce(response.data);
  return {
    data,
    isLoginPage: false,
    fetched: true,
  };
};

export const cacheAnnounceData = (data: string[]) => {
  console.log('[DATA] Caching announce data');
  storage.storeAnnounceData(data);
};
