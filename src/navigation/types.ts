import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { IMessage } from '../models/messages';
import { ISubject } from '../models/sessionPoints';
import { ILesson } from '../models/timeTable';

// Список экранов для основного стека
export type RootStackParamList = {
  // Первая группа. Имеет хэдер и соответствую для него настройки
  Auth: undefined;
  History: { data: IMessage[]; page: number };
  SignsDetails: { subject: ISubject };
  CertificateIncome: undefined;
  SessionQuestionnaire: { url: string };
  DisciplineInfo: { lesson: ILesson; date: string; pairPosition: number };
  DisciplineTasks?: { taskId?: string };
  BellSchedule: undefined;

  // Вторая группа. Не имеет хэдера
  TabNavigator: undefined;
  NewYearTheme: undefined;
  Onboarding: undefined;
};

// Список экранов с нижними табами
export type BottomTabsParamList = {
  Timetable: undefined;
  SignsNavigator: undefined;
  Messages: undefined;
  Announces: undefined;
  ServicesNavigator: undefined;
};

// Список экранов для сервисов
export type ServicesNativeStackParamList = {
  Services: undefined;
  TeachPlan: undefined;
  Teachers: undefined;
  Absences: undefined;
  Orders: undefined;
  Certificate: undefined;
  RequestCertificate: undefined;
  Settings: undefined;
  AboutApp: undefined;
  SessionQuestionnaireList: undefined;
  PersonalRecords: undefined;
  ChangePassword: undefined;
  ChangeEmail: { sendVerificationMail: boolean };
  CathedraTimetable: { teacherId?: string; cathedraId?: string };
  ChangeAppUI: undefined;
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
