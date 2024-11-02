import { LessonTypes } from './other';

export enum DistancePlatformTypes {
  unknown,
  bbb,
  zoom,
  skype,
}

export enum WeekTypes {
  common,
  session,
  holiday,
  practice,
  elective,
}

export interface WeekDates {
  // Дата начала недели
  start: string;
  // Дата окончания недели
  end: string;
}

export interface WeekInfo {
  // Первая неделя
  first: number;
  // Выбранная неделя
  selected: number;
  // Последняя неделя
  last: number;
  // Тип недели
  type?: WeekTypes;
  // Даты начала и окончания недели
  dates?: WeekDates;
  // Даты начала и окончания каникул
  holidayDates?: WeekDates;
}

export interface DistancePlatform {
  // Название платформы
  name: string;
  // Тип платформы
  type: DistancePlatformTypes;
  // Ссылка на место проведения занятия
  url: string;
  // Ссылка на изображение платформы
  imageUrl: string;
}

export interface ITeacher {
  // Идентификатор преподавателя
  id?: string;
  // ФИО преподавателя
  name: string;
}

export interface ISubject {
  // Необработанная строка предмета
  string: string;
  // Дисциплина
  discipline?: string;
  // Тип занятия
  type?: LessonTypes;
}

export interface IAudience {
  // Идентификатор аудитории в ЕТИС. Доступно только в расписании аудитории
  id?: number;
  // Необработанная строка аудитории
  string: string;
  // Номер аудитории
  number?: string;
  // Корпус
  building?: string;
  // Этаж
  floor?: string;

  // Дополнительная информация об аудитории. Только в расписании преподавателей
  info?: string;
}

export interface ILesson {
  // Предмет занятия
  subject: ISubject;
  // Аудитория
  audience: IAudience;
  // Является ли занятие дистанционным
  isDistance: boolean;
  // Информация об дистанционной платформе
  distancePlatform?: DistancePlatform;
  // Преподаватель занятия
  teacher?: ITeacher;
  // HTML-код объявления
  announceHTML?: string;

  // Полный список групп, присутствующие на занятии. Только в расписании преподавателей
  groups?: string[];
  // Краткий список групп, присутствующие на занятии. Только в расписании преподавателей
  shortGroups?: string[];
}

export interface IPair {
  // Позиция пары
  position: number;
  // Время проведения пары
  time: string;
  // Список занятий на эту пару
  lessons: ILesson[];
}

export interface ITimeTableDay {
  // Дата учебного дня
  date: string;
  // Список пар в этот день
  pairs: IPair[];
}

export interface ITimeTable {
  // Информация об учебной недели
  weekInfo: WeekInfo;
  // Список дней
  days: ITimeTableDay[];

  // Преподаватель. Только в расписании преподавателей
  teacher?: ITeacher;

  // Аудитория. Только в расписании аудиторий
  audience?: IAudience;

  // Доступно только для авторизованных студентов
  icalToken?: string;
}
