import { IGetPayload, IGetResult } from '../models/results';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { IGetMessagesPayload, IMessagesData } from '../models/messages';

export interface BaseClient {
  getAnnounceData(payload: IGetPayload): Promise<IGetResult<string[]>>;
  getTimeTableData(payload: ITimeTableGetProps): Promise<IGetResult<ITimeTable>>;
  getMessagesData(payload: IGetMessagesPayload): Promise<IGetResult<IMessagesData>>;
}
