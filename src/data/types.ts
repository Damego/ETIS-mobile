import { GetPayload } from '../models/results';

export interface GetTimeTablePayload extends GetPayload {
  week: number;
}
