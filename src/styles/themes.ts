import { StatusBarStyle } from 'expo-status-bar/src/StatusBar.types';

export enum ThemeType {
  auto = 'auto',
  light = 'light',
  dark = 'dark',
  black = 'black',
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
  // Нижняя панель навигации
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
  dark: false,
  statusBarStyle: 'dark',
  colors: {
    background: '#F6F6F6',
    primary: '#C62E3E',
    secondary: '#F9F0F1',
    primaryContrast: "#FFFFFF",
    secondaryContrast: "#FFFFFF",
    border: '#EAEAEA',
    text: '#000000',
    text2: "#2C2C2C",
    inputPlaceholder: '#A9A9AC',
    container: '#FFFFFF',
    card: '#FFFFFF',
    notification: '#EAEAEA',
  },
};

export const DarkTheme: ITheme = {
  dark: true,
  statusBarStyle: 'light',
  colors: {
    background: '#121212',
    primary: '#C62E3E',
    secondary: '#C62E3E',
    border: '#3B3B3B',
    text: '#DDDDDD',
    textForPrimary: '#FFFFFF',
    textForSecondary: '#FFFFFF',
    textForBlock: '#DDDDDD',
    inputPlaceholder: '#A9A9AC',
    block: '#222222',
    card: '#222222',
    shadow: '#FFFFFF',
    notification: '#3B3B3B',
  },
};

export const BlackTheme: ITheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#000000',
    block: '#000000',
  },
};

export const APP_THEMES = {
  light: LightTheme,
  dark: DarkTheme,
  black: BlackTheme,
};

