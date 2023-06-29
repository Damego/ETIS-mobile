import { IGetMessagesPayload, IMessagesData } from '../models/messages';
import { emptyResult, IGetResult } from '../models/results';
import { httpClient, storage } from '../utils';
import { isLoginPage } from '../parser/utils';
import parseMessages from '../parser/messages';
import { HTTPError } from '../utils/http';

export const getCachedMessagesData = async (page: number): Promise<IGetResult<IMessagesData>> => {
  console.log(`[DATA] use cached messages for ${page} page`);

  return {
    ...emptyResult,
    data: await storage.getMessages(page)
  }
}

export const getMessagesData = async (payload: IGetMessagesPayload): Promise<IGetResult<IMessagesData>> => {
  if (payload.useCacheFirst) {
    const result = await getCachedMessagesData(payload.page);
    if (result.data) return result;
  }

  const response = await httpClient.getMessages(payload.page);

  if ((response as HTTPError).error || !response) {
    if (payload.useCache) {
      return await getCachedMessagesData(payload.page);
    }
    return emptyResult;
  }

  if (isLoginPage(response as string)) {
    return {
      ...emptyResult,
      isLoginPage: true
    }
  }

  const data = parseMessages(response as string);

  console.log(`[DATA] Fetched messages for ${data.page} page`)

  cacheMessagesData(data);

  return {
    data,
    isLoginPage: false,
    fetched: true
  }
}

export const cacheMessagesData = (data: IMessagesData) => {
  console.log(`[DATA] Caching messages for ${data.page} page`);

  storage.storeMessages(data);
}