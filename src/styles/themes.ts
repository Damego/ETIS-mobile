import { DefaultTheme } from '@react-navigation/native';
import { StatusBarStyle } from 'expo-status-bar/src/StatusBar.types';

export enum ThemeType {
  auto = 'auto',
  light = 'light',
  dark = 'dark',
  black = 'black',
  halloween = 'halloween',
  newYear = 'newYear',
}

export interface IThemeColors {
  // Цвет для заднего фона
  background: string;
  // Основной цвет
  primary: string;
  // Дополнительный цвет
  secondary: string;
  // Контрастный цвет для основного
  primaryContrast: string;
  // Контрастный цвет для дополнительного
  secondaryContrast: string;
  // Цвет обводки
  border: string;
  // Основной цвет текста
  text: string;
  text2: string;
  inputPlaceholder: string;
  // Цвет главных контейнеров
  container: string;
  // Цвет карточек
  cards: string;
  // Нижняя панель навигации. Не путать с `cards`
  card: string;
  // ?
  notification: string;
}

export interface ITheme {
  dark: boolean;
  statusBarStyle: StatusBarStyle;
  backgroundImage?: any;
  colors: IThemeColors;
}

export const LightTheme: ITheme = {
  fonts: DefaultTheme.fonts,
  dark: false,
  statusBarStyle: 'dark',
  colors: {
    background: '#FFFFFF',
    primary: '#C62E3E',
    secondary: '#F9F0F1',
    primaryContrast: '#FFFFFF',
    secondaryContrast: '#FFFFFF',
    border: '#EAEAEA',
    text: '#2C2C2C',
    text2: '#A9A9AC',
    inputPlaceholder: '#A9A9AC',
    container: '#FFFFFF',
    cards: '#F9F9F9',
    card: '#FFFFFF',
    notification: '#EAEAEA',
  },
};

export const DarkTheme: ITheme = {
  fonts: DefaultTheme.fonts,
  dark: true,
  statusBarStyle: 'light',
  colors: {
    background: '#141313',
    primary: '#C62E3E',
    secondary: '#5A5349',
    primaryContrast: '#FFFFFF',
    secondaryContrast: '#FFFFFF',
    border: '#A9A9AC',
    text: '#EFEBEB',
    text2: '#A9A9AC',
    inputPlaceholder: '#A9A9AC',
    container: '#141313',
    cards: '#222222',
    card: '#141313',
    notification: '#121212',
  },
};

export const BlackTheme: ITheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,

    background: '#000000',
    container: '#000000',
    card: '#000000',
    cards: '#222222',
  },
};

export const APP_THEMES = {
  light: LightTheme,
  dark: DarkTheme,
  black: BlackTheme,
};
