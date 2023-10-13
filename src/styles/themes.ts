import { StatusBarStyle } from 'expo-status-bar/src/StatusBar.types';

export interface ITheme {
  dark: boolean;
  statusBarStyle: StatusBarStyle;
  disabledCardBorder?: boolean;
  colors: {
    background: string;
    backgroundGradient?: string[];
    primary: string;
    border: string;
    text: string;
    inputPlaceholder: string;
    block: string;
    // Нижняя панель навигации
    card: string;
    shadow: string;
    notification: string;
  };
}

export const LightTheme: ITheme = {
  dark: false,
  statusBarStyle: 'dark',
  colors: {
    background: '#F8F8FA',
    primary: '#C62E3E',
    border: '#EAEAEA',
    text: '#000000',
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
    border: '#3B3B3B',
    text: '#DDDDDD',
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
    border: '#6A5787',
    text: '#EDEDED',
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
