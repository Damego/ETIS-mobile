import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { ISessionSignsData } from '../models/sessionPoints';
import { ISessionTeachPlan } from '../models/teachPlan';
import { TeacherType } from '../models/teachers';
import { ITimeTable } from '../models/timeTable';
import { UserCredentials } from '../redux/reducers/authSlice';
import { ThemeType } from '../redux/reducers/settingsSlice';
import { IOrder } from '../models/order';
import { IMessage, IMessagesData } from '../models/messages';

export default class Storage {
  async bumpReviewRequest() {
    const reviewStep = await SecureStore.getItemAsync('reviewStep');
    if (reviewStep === null) {
      // первый запуск
      await SecureStore.setItemAsync('reviewStep', 'first-login');
    } else if (reviewStep === 'first-login') {
      // второй запуск - предложить отставить отзыв
      return true;
    }
    return false;
  }

  async setReviewSubmitted() {
    await SecureStore.setItemAsync('reviewStep', 'stop');
  }

  async storeAccountData(login: string, password: string) {
    await SecureStore.setItemAsync('userLogin', login);
    await SecureStore.setItemAsync('userPassword', password);
  }

  async getAccountData(): Promise<UserCredentials | null> {
    const login = await SecureStore.getItemAsync('userLogin');

    if (login === null) return null;

    const password = await SecureStore.getItemAsync('userPassword');
    return {
      login,
      password,
    };
  }

  async deleteAccountData() {
    await SecureStore.deleteItemAsync('userLogin');
    await SecureStore.deleteItemAsync('userPassword');
  }

  hasAcceptedPrivacyPolicy() {
    return SecureStore.getItemAsync('hasAcceptedPrivacyPolicy');
  }

  async acceptPrivacyPolicy() {
    await SecureStore.setItemAsync('hasAcceptedPrivacyPolicy', 'true');
  }

  async getTimeTableData(week: number): Promise<ITimeTable> {
    let stringData;
    if (week === undefined) {
      stringData = await AsyncStorage.getItem('timetable-current');
    } else stringData = await AsyncStorage.getItem(`timetable-${week}`);

    return JSON.parse(stringData);
  }

  async storeTimeTableData(data: ITimeTable, week?: number) {
    const stringData = JSON.stringify(data);

    if (week === undefined) {
      await AsyncStorage.setItem('timetable-current', stringData);
    } else await AsyncStorage.setItem(`timetable-${week}`, stringData);
  }

  async getTeacherData(): Promise<TeacherType | null> {
    const stringData = await AsyncStorage.getItem('teachers');
    return JSON.parse(stringData);
  }

  storeTeacherData(data: TeacherType) {
    return AsyncStorage.setItem('teachers', JSON.stringify(data));
  }

  async getSignsData(session: number): Promise<ISessionSignsData> {
    const stringData = await AsyncStorage.getItem(`session-${session}`);
    return JSON.parse(stringData);
  }

  storeSignsData(data: ISessionSignsData, storeForUndefined?: boolean) {
    const stringData = JSON.stringify(data);
    AsyncStorage.setItem(`session-${data.currentSession}`, stringData);
    if (storeForUndefined) AsyncStorage.setItem(`session-undefined`, stringData);
  }

  async getMarksData() {
    const stringData = await AsyncStorage.getItem(`marks`);
    return JSON.parse(stringData);
  }

  async storeMarksData(data) {
    return AsyncStorage.setItem(`marks`, JSON.stringify(data));
  }

  storeAppTheme(theme: ThemeType) {
    return AsyncStorage.setItem('theme', theme);
  }

  async getAppTheme(): Promise<ThemeType> {
    const theme = await AsyncStorage.getItem('theme');
    if (theme === null) return ThemeType.auto;
    return ThemeType[theme];
  }

  async hasViewedIntro() {
    return (await AsyncStorage.getItem('viewedIntro')) !== null;
  }

  async setViewedIntro() {
    await AsyncStorage.setItem('viewedIntro', 'true');
  }

  async getTeachPlan(): Promise<ISessionTeachPlan[]> {
    const stringData = await AsyncStorage.getItem('teachPlan');
    return JSON.parse(stringData);
  }

  storeTeachPlan(data: ISessionTeachPlan[]) {
    return AsyncStorage.setItem('teachPlan', JSON.stringify(data));
  }

  async getAnnounceData(): Promise<string[]> {
    const stringData = await AsyncStorage.getItem('announce');
    return JSON.parse(stringData);
  }

  storeAnnounceData(data: string[]) {
    AsyncStorage.setItem('announce', JSON.stringify(data));
  }

  async getOrdersData(): Promise<IOrder[]> {
    const stringData = await AsyncStorage.getItem('orders');
    return JSON.parse(stringData);
  }

  storeOrdersData(data: IOrder[]) {
    AsyncStorage.setItem('orders', JSON.stringify(data))
  }

  async getOrderHTML(orderID: string): Promise<string> {
    return await AsyncStorage.getItem(`order-${orderID}`)
  }

  storeOrderHTML(orderID: string, html: string) {
    AsyncStorage.setItem(`order-${orderID}`, html);
  }

  async getMessages(page: number): Promise<IMessagesData> {
    const stringData = await AsyncStorage.getItem(`messages-${page}`);
    return JSON.parse(stringData);
  }

  storeMessages(data: IMessagesData) {
    AsyncStorage.setItem(`messages-${data.page}`, JSON.stringify(data));
  }
}