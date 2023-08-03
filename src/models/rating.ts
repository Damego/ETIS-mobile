import { ISession } from './session';

export interface OverallRating {
  top: number;
  total: number;
}

export interface IDisciplineRanking extends OverallRating{
  discipline: string;
  controlPoints: number
  passedControlPoints: number
  points: number
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
