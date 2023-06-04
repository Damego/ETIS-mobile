export interface ITeachPlanDiscipline {
  name: string;
  reporting: string;
  classWorkHours: number;
  soloWorkHours: number;
  totalWorkHours: number;
}

export interface ISessionTeachPlan {
  disciplines: ITeachPlanDiscipline[];
  stringSession: string;
}