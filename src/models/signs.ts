import { IGetPayload } from './results';

export interface IGetSignsPayload extends IGetPayload {
  session?: number;
}
