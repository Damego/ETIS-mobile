import { ICheckPoint } from '~/models/sessionPoints';

export interface IDifferentCheckPoint {
  oldResult: ICheckPoint;
  newResult: ICheckPoint;
  subjectName: string;
}
