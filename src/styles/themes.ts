import { StatusBarStyle } from 'expo-status-bar/src/StatusBar.types';

export interface IThemeColors {
  // Цвет для заднего фона
  background: string;
  // Градиент для заднего фона
  backgroundGradient?: string[];
  // Основной цвет
  primary: string;
  // Дополнительный цвет
  secondary: string;
  // Цвет обводки
  border: string;
  // Основной цвет текста
  text: string;
  // Цвет текста, если фон основного цвета
  textForPrimary: string;
  // Цвет текста, если фон дополнительного цвета
  textForSecondary: string;
  // Цвет для плейсхолдера инпута
  inputPlaceholder: string;
  // Цвет для фона блоков с информацией i.e. Card
  block: string;
  // Нижняя панель навигации
  card: string;
  // Цвет тени
  shadow: string;
  // ?
  notification: string;
}

export interface ITheme {
  dark: boolean;
  statusBarStyle: StatusBarStyle;
  disabledCardBorder?: boolean;
  colors: IThemeColors;
}

export const LightTheme: ITheme = {
  dark: false,
  statusBarStyle: 'dark',
  colors: {
    background: '#F8F8FA',
    primary: '#C62E3E',
    secondary: '#C62E3E',
    border: '#EAEAEA',
    text: '#000000',
    textForPrimary: '#FFFFFF',
    textForSecondary: '#FFFFFF',
    inputPlaceholder: '#A9A9AC',
    block: '#FFFFFF',
    card: '#FFFFFF',
    shadow: '#000000',
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

export const HalloweenTheme: ITheme = {
  dark: false,
  statusBarStyle: 'light',
  disabledCardBorder: true,
  colors: {
    background: 'transparent',
    backgroundGradient: ['#33135b', '#24155c'],
    primary: '#ff8629',
    secondary: '#6536F2',
    border: '#6A5787',
    text: '#EDEDED',
    textForPrimary: '#FFFFFF',
    textForSecondary: '#FFFFFF',
    inputPlaceholder: '#6A5787',
    block: '#361f7a',
    card: '#33135b',
    shadow: '#000000',
    notification: '#EAEAEA',
  },
};

export const APP_THEMES = {
  light: LightTheme,
  dark: DarkTheme,
  black: BlackTheme,
  halloween: HalloweenTheme,
};
