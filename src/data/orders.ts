import { cache } from '~/cache/smartCache';
import { IOrder } from '~/models/order';
import { httpClient } from '~/utils';
import logger from '~/utils/logger';

export const getOrderHTML = async (order: IOrder): Promise<string | undefined> => {
  const cached = await cache.getOrder(order.id ?? '');
  if (cached) {
    logger.log('[DATA] Use cached order html');
    return cached;
  }

  const fetched = await httpClient.request('GET', `/${order.uri ?? ''}`, { returnResponse: false });
  if (fetched.error) return undefined;

  logger.log('[DATA] fetched order html');

  cache.placeOrder(order.id ?? '', fetched.data ?? '');

  logger.log('[DATA] cached order html');

  return fetched.data;
};
