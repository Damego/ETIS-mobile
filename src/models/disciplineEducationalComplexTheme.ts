export interface IThemeWorkHours {
  label: string;
  hours: string;
}

export interface IListItem {
  title: string;
  url?: string;
}

export interface IDisciplineEducationalComplexTheme {
  workHours: IThemeWorkHours[];
  annotation: string;
  requiredLiterature: IListItem[];
  additionalLiterature: IListItem[];
  links: IListItem[];
  controlRequirements: string;
}

export interface IDisciplineEducationalComplexThemePayload {
  disciplineTeachPlanId: string;
  themeId: string;
}