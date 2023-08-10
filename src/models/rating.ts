import { ISession } from './session';
import { IGetPayload } from './results';

export interface OverallRating {
  top: number;
  total: number;
}

export interface IDisciplineRanking extends OverallRating {
  discipline: string;
  controlPoints: number;
  passedControlPoints: number;
  points: number;
}

export interface IGroup {
  name: string;
  overall?: OverallRating;
  disciplines: IDisciplineRanking[];
}

export interface ISessionRating {
  session: ISession;
  groups: IGroup[];
}

export interface IGetRatingPayload extends IGetPayload {
  session: number;
}
