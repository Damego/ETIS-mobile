import { IPointUpdates } from '../models/pointUpdates';
import { executeRegex } from '../utils/sentry';

const lastPointDateRegex = /([0-9]{2}\.[0-9]{2}\.[0-9]{4}\s)/m;

export default function parsePointUpdates(data: string, url: string): IPointUpdates {
  if (data.length === 1) return null;

  // В данный момент нет необходимости получать все даты обновления баллов контрольной точки,
  // поэтому получаем последнее обновление.
  const date = executeRegex(lastPointDateRegex, data)[0];
  return { url, date };
}
