import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { IMessage } from '../models/messages';
import { ISubject } from '../models/sessionPoints';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  TabNavigator: undefined;
  History: { data: IMessage[]; page: number };
  SignsDetails: { subject: ISubject };
  SessionQuestionnaire: { url: string };
};

export type BottomTabsParamList = {
  Timetable: undefined;
  SignsNavigator: undefined;
  Messages: undefined;
  Announces: undefined;
  ServicesNavigator: undefined;
};

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
};

export type SignsTopTabsParamsList = {
  Points: undefined;
  Rating: undefined;
};

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

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type BottomTabsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabsParamList>,
  RootStackNavigationProp
>;
export type ServicesNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ServicesNativeStackParamList>,
  BottomTabsNavigationProp
>;
