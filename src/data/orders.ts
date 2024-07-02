import { cache } from '~/cache/smartCache';
import { IOrder } from '~/models/order';
import { httpClient } from '~/utils';

export const getOrderHTML = async (order: IOrder): Promise<string> => {
  const cached = await cache.getOrder(order.id);
  if (cached) {
    console.log('[DATA] Use cached order html');
    return cached;
  }

  const fetched = await httpClient.request('GET', `/${order.uri}`, { returnResponse: false });
  if (fetched.error) return;

  console.log('[DATA] fetched order html');

  cache.placeOrder(order.id, fetched.data);

  console.log('[DATA] cached order html');

  return fetched.data;
};
