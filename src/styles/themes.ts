import { StatusBarStyle } from 'expo-status-bar/src/StatusBar.types';

export enum ThemeType {
  auto = 'auto',
  light = 'light',
  dark = 'dark',
  black = 'black',
  halloween = 'halloween',
  newYear = 'newYear',
  blueNewYear = 'blueNewYear',
  greenNewYear = 'greenNewYear',
}

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
  // Цвет текста для блоков
  textForBlock: string;
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
  backgroundImage?: any;
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
    textForBlock: '#000000',
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

export const HalloweenTheme: ITheme = {
  dark: false,
  statusBarStyle: 'light',
  disabledCardBorder: true,
  colors: {
    background: 'transparent',
    // Весь фон стоит за навигацией, потому что фон должен быть и на хэдере.
    // Однако навигация перекрывает фон цветом background, именно поэтому здесь стоит
    // transparent, а цвет фона определяется градиентом (даже если там 2 одинаковых цвета)
    backgroundGradient: ['#33135b', '#24155c'],
    primary: '#ff8629',
    secondary: '#6536F2',
    border: '#6A5787',
    text: '#EDEDED',
    textForPrimary: '#FFFFFF',
    textForSecondary: '#FFFFFF',
    inputPlaceholder: '#6A5787',
    textForBlock: '#EDEDED',
    block: '#361f7a',
    card: '#33135b',
    shadow: '#000000',
    notification: '#EAEAEA',
  },
};

export const NewYearTheme: ITheme = {
  dark: false,
  statusBarStyle: 'light',
  disabledCardBorder: false,
  // backgroundImage: require('../../assets/background.png'),
  colors: {
    background: 'transparent',
    backgroundGradient: ['#9b1b2a', '#9b1b2a'],
    primary: '#FFC63E',
    secondary: '#FFC63E',
    border: '#9b1b2a',
    text: '#FFF4DB',
    textForPrimary: '#FEFEFE',
    textForSecondary: '#FEFEFE',
    textForBlock: '#000000',
    inputPlaceholder: '#B1A796',
    block: '#FFF4DB',
    card: '#9b1b2a',
    shadow: '#000000',
    notification: '#EAEAEA',
  },
};

export const BlueNewYearTheme: ITheme = {
  dark: false,
  statusBarStyle: 'light',
  disabledCardBorder: false,
  // backgroundImage: require('../../assets/background-blue.png'),
  colors: {
    background: 'transparent',
    backgroundGradient: ['#131723', '#131723'],
    primary: '#409ad4',
    secondary: '#c42e21',
    border: '#2e3c5f',
    text: '#FEFEFE',
    textForPrimary: '#FEFEFE',
    textForSecondary: '#FEFEFE',
    inputPlaceholder: '#415485',
    textForBlock: '#FEFEFE',
    block: '#1c2439',
    card: '#131723',
    shadow: '#000000',
    notification: '#EAEAEA',
  },
};

export const GreenNewYearTheme: ITheme = {
  dark: false,
  statusBarStyle: 'light',
  disabledCardBorder: false,
  // backgroundImage: require('../../assets/background-green.png'),
  colors: {
    background: 'transparent',
    backgroundGradient: ['#14413C', '#14413C'],
    primary: '#D25455',
    secondary: '#D25455',
    border: '#14413C',
    text: '#F5E0A7',
    textForPrimary: '#000000',
    textForSecondary: '#FEFEFE',
    textForBlock: '#000000',
    inputPlaceholder: '#B1A796',
    block: '#FEEFD8',
    card: '#14413C',
    shadow: '#000000',
    notification: '#EAEAEA',
  },
};

export const APP_THEMES = {
  light: LightTheme,
  dark: DarkTheme,
  black: BlackTheme,
  halloween: HalloweenTheme,
  newYear: NewYearTheme,
  blueNewYear: BlueNewYearTheme,
  greenNewYear: GreenNewYearTheme,
};

export const isNewYearTheme = (theme: ThemeType) =>
  [ThemeType.newYear, ThemeType.blueNewYear, ThemeType.greenNewYear].includes(theme);
