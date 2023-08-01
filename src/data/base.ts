import { GetPayload, IGetResult } from '../models/results';
import { ITimeTable } from '../models/timeTable';
import { GetTimeTablePayload } from './types';

export interface BaseClient {
  getAnnounceData(payload: GetPayload): Promise<IGetResult<string[]>>;
  getTimeTableData(payload: GetTimeTablePayload): Promise<IGetResult<ITimeTable>>;
}
