export interface ITeacherPSUData {
  page_url: string;
  image_url: string;
  contacts: {
    phones: string[];
    emails: string[];
  };
}

export interface ITeacher {
  id: number;
  name: string;

  etis?: object;
  psu?: ITeacherPSUData;
}

export interface IFaculty {
  id: string;
  name: string;
  psu_page_url: string;
  logo_image_url: string;
  contacts: object;
}

export interface IGroup {
  id: string;
  name: {
    short: string;
    full: string;
  };
  year: number;
  faculty: {
    id: string;
    shortName: string;
  };
  degree: string;
  speciality: string;
  period_type: PeriodTypes;
}

export enum PeriodTypes {
  TRIMESTER,
  SEMESTER,
}

export interface IPeriodWeek {
  period_type: PeriodTypes;
  year: number;
  periods_to_weeks: number[][];
}
