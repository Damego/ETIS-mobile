export interface ISpeciality {
  name, code?: string;
  groups: IGroup[];
}
export interface IGroup {
  id: number;
  name: string;
}
