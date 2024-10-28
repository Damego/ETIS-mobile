export interface ITeachPlanDiscipline {
  id?: string;
  teachPlanId?: string;
  name: string;
  reporting: string;
  classWorkHours: number;
  soloWorkHours: number;
  totalWorkHours: number;
}

export interface ISessionTeachPlan {
  disciplines: ITeachPlanDiscipline[];
  period: {
    string: string;
    number: number;
    name: string;
  };
}
