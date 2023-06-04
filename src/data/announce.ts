import { IGetPayload, IGetResult, emptyResult } from '../models/results';
import { parseAnnounce } from '../parser';
import { httpClient, storage } from '../utils';

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

  const html = await httpClient.getAnnounce();

  if (!html) {
    if (!payload.useCache) return emptyResult;
    return await getCachedAnnounceData();
  }

  console.log('[DATA] Fetched announce data');

  const data = parseAnnounce(html);
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
