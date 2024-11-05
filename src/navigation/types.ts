import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { IAvailableCertificate } from '~/models/certificate';
import { IDisciplineEducationalComplexThemeLink } from '~/models/disciplineEducationalComplex';
import { IMessage } from '~/models/messages';
import { ITeachPlanDiscipline } from '~/models/teachPlan';
import { IAudience, ILesson } from '~/models/timeTable';

// Список экранов для основного стека
export type RootStackParamList = {
  TabNavigator: undefined;

  AppSettings: undefined;
  ChangeAppTheme: undefined;
  ChangeAppUI: undefined;
  AboutApp: undefined;
  ReleaseNotes: undefined;
  // Onboarding: undefined;
};

export type StartStackParamList = {
  Start: undefined;
  SelectTeacher: undefined;
  SelectStudentAccountType: undefined;
  SelectFaculty: undefined;
  SelectGroup: { facultyId: string };

  TeacherNavigator: undefined;
  UnauthorizedStudentNavigator: undefined;
  AuthorizedStudentNavigator: undefined;
};

export type UnauthorizedTeacherStackParamList = {
  Timetable: undefined;
  AccountSettings: undefined;
  DisciplineInfo: { lesson: ILesson; date: string; pairPosition: number };
};

export type UnauthorizedStudentStackParamList = {
  Timetable: undefined;
  AccountSettings: undefined;
  DisciplineInfo: { lesson: ILesson; date: string; pairPosition: number };
};

// Список экранов для ЕТИС
export type EducationStackParamList = {
  // Экран аутентификации в ЕТИС
  Auth: undefined;
  // Главный экран ЕТИС
  Main: undefined;
  // Настройки аккаунта
  AccountSettings: undefined;

  // Информация о паре
  DisciplineInfo: { lesson: ILesson; date: string; pairPosition: number };
  // Учебно-методический комплекс
  DisciplineEducationalComplex: {
    disciplineTeachPlan: ITeachPlanDiscipline;
    period: string;
  };
  DisciplineEducationalComplexTheme: {
    theme: IDisciplineEducationalComplexThemeLink;
    disciplineName: string;
  };

  // Меню с экранами

  // Недельное расписание
  Timetable: undefined;
  // Учебный план
  TeachPlan: undefined;
  // Преподаватели
  Teachers: undefined;
  // Пропущенные занятия
  Absences: undefined;
  // Приказы
  Orders: undefined;
  // Список справок
  Certificate: undefined;
  // Заказ справки
  RequestCertificate: IAvailableCertificate[];
  // Список доступных для анкетирования дисциплин
  SessionQuestionnaireList: undefined;
  // Расписание звонков
  BellSchedule: undefined;
  // Рейтинг
  Rating: undefined;

  // Остальные экраны

  // История сообщений
  MessageHistory: { data: IMessage[]; page: number };
  // Заказ справки о доходах
  CertificateIncome: undefined;
  // Анкетирование по прошедшему триместру/семестру
  SessionQuestionnaire: { url: string };
  // Список заданий
  DisciplineTasks: { taskId?: string };
  // Смена пароля
  ChangePassword: undefined;
  // Смена электронной почты
  ChangeEmail: { sendVerificationMail: boolean };
  // Расписание преподавателей/кафедр
  CathedraTimetable: { teacherId?: string; cathedraId?: string };
  SelectAudience: undefined;
  AudienceTimetable: { audience: IAudience };
};

// Список экранов с нижними табами
export type BottomTabsParamList = {
  Education: undefined;
  Services: undefined;
  NewsAndEvents: undefined;
};

// Список экранов для сервисов
export type ServicesNativeStackParamList = {
  Services: undefined;
  // TODO: check Notion
};

// Список экранов для оценок с верхними табами
export type SignsTopTabsParamsList = {
  Points: undefined;
  Rating: undefined;
};

// Типы параметров для экранов-компонентов (navigation, route)

export type RootStackScreenProps<ScreenName extends keyof RootStackParamList = undefined> =
  StackScreenProps<RootStackParamList, ScreenName>;
export type BottomTabsScreenProps<ScreenName extends keyof BottomTabsParamList = undefined> =
  CompositeScreenProps<BottomTabScreenProps<BottomTabsParamList, ScreenName>, RootStackScreenProps>;

export type EducationStackScreenProps<
  ScreenName extends keyof EducationStackParamList = undefined,
> = CompositeScreenProps<
  StackScreenProps<EducationStackParamList, ScreenName>,
  RootStackScreenProps
>;

export type ServiceNativeStackScreenProps<
  ScreenName extends keyof ServicesNativeStackParamList = undefined,
> = CompositeScreenProps<
  NativeStackScreenProps<ServicesNativeStackParamList, ScreenName>,
  BottomTabsScreenProps
>;

export type StartStackScreenProps<ScreenName extends keyof StartStackParamList = undefined> =
  CompositeScreenProps<StackScreenProps<StartStackParamList, ScreenName>, RootStackScreenProps>;

export type UnauthorizedTeacherStackScreenProps<
  ScreenName extends keyof UnauthorizedTeacherStackParamList = undefined,
> = CompositeScreenProps<
  StackScreenProps<UnauthorizedTeacherStackParamList, ScreenName>,
  StartStackScreenProps
>;

// Типы для хука useNavigation

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type BottomTabsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabsParamList>,
  RootStackNavigationProp
>;
export type ServicesNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ServicesNativeStackParamList>,
  BottomTabsNavigationProp
>;
export type EducationNavigationProp = CompositeNavigationProp<
  StackNavigationProp<EducationStackParamList>,
  BottomTabsNavigationProp
>;
