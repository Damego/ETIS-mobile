import { GetResultType, IGetResult } from '../models/results';

export const toResult = <T>(data: T): IGetResult<T> => ({
  type: GetResultType.cached,
  data,
});