import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { IMessage } from '~/models/messages';
import { ISubject } from '~/models/sessionPoints';
import { ILesson } from '~/models/timeTable';

// Список экранов для основного стека
export type RootStackParamList = {
  TabNavigator: undefined;

  AppSettings: undefined;
  ChangeAppTheme: undefined;
  AboutApp: undefined;
  ReleaseNotes: undefined;
  // Onboarding: undefined;
};

// Список экранов для ЕТИС
export type EducationStackParamList = {
  // Экран аутентификации в ЕТИС
  Auth: undefined;
  // Главный экран ЕТИС
  Main: undefined;
  // Настройки аккаунта
  AccountSettings: undefined;

  // Быстрый доступ к важным экранам

  // Экран с оценками
  SignsNavigator: undefined;
  // Экран с сообщениями
  Messages: undefined;
  // Экран с объявлениями
  Announces: undefined;
  // Экран со списком остальных экранов для ЕТИС
  MoreScreens: undefined;
  // Информация о паре
  DisciplineInfo: { lesson: ILesson; date: string; pairPosition: number };

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
  RequestCertificate: undefined;
  // Список доступных для анкетирования дисциплин
  SessionQuestionnaireList: undefined;
  // Расписание звонков
  BellSchedule: undefined;

  // Остальные экраны

  // История сообщений
  History: { data: IMessage[]; page: number };
  // Подробности о выставленных баллах
  SignsDetails: { subject: ISubject };
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
export type ServiceNativeStackScreenProps<
  ScreenName extends keyof ServicesNativeStackParamList = undefined,
> = CompositeScreenProps<
  NativeStackScreenProps<ServicesNativeStackParamList, ScreenName>,
  BottomTabsScreenProps
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
