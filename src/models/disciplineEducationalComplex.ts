import { IFile } from '~/models/other';

export interface IDisciplineEducationalComplexThemeLink {
  // Идентификатор темы
  id: string;
  // Идентификатор учебного плана дисциплины
  disciplineTeachPlanId: string;
  // Название темы
  name: string;
  // Рабочие часы
  workHours: {
    // Аудиторные часы
    class: number;
    // Все часы
    total: number;
  };
  // Подтемы
  subthemes: IDisciplineEducationalComplexThemeLink[];
  // Имеется ли контроль у этой темы
  hasCheckPoint: boolean;
}

export interface IAdditionalMaterials {
  // Список файлов
  files: IFile[];
}

export interface ICriteria {
  // Заголовок критерия
  title: string;
  // Описание критерия
  description: string;
}

export interface IPlannedLearningOutcome {
  // Текстовое описание результатов обучения
  outcome: string;
  // Список критериев
  criteria: ICriteria[];
}

// Вопросы промежуточной аттестации
export interface IExamQuestions {
  // Идентификатор списка вопросов
  id: string;
  // Заголовок списка вопросов промежуточной аттестации
  title: string;
}

// Показатели оценивания
export interface IEvaluationIndicators {
  // Промежуточный контроль
  control: string;
  // Способ проведения
  method: string;
  // Продолжительность промежуточного контроля
  duration: string;
  // Список показателей оценивания
  criteria: ICriteria[];
}

// Учебно-методический комплекс дисциплины
export interface IDisciplineEducationalComplex {
  // Название дисциплины
  discipline: string;
  // Список тем
  themes?: IDisciplineEducationalComplexThemeLink[];
  // Дополнительные материалы
  additionalMaterials?: IAdditionalMaterials;
  // Планируемый результат обучения
  plannedLearningOutcome?: IPlannedLearningOutcome[];
  // Вопросы промежуточной аттестации
  examQuestions?: IExamQuestions[];
  // Показатели оценивания
  evaluationIndicators?: IEvaluationIndicators;
}

export interface IDisciplineEducationalComplexPayload {
  disciplineId: string;
  disciplineTeachPlanId: string;
}
