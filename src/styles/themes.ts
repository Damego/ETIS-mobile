export type StatusBarStyle = 'auto' | 'inverted' | 'light' | 'dark';

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
  statusBarStyle?: StatusBarStyle;
  backgroundImage?: any;
  // Градиент для заднего фона (событийные темы). Если задан —
  // поверх background рендерится градиент на весь экран
  backgroundGradient?: string[];
  colors: IThemeColors;
}

export const LightTheme: ITheme = {
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

// Событийные темы включаются автоматически в праздничные даты
// (см. redux/manageEventTheme.ts и utils/events.ts).
// Адаптация старых тем (81dd1a2, d2f3ebe) под текущую схему цветов:
// textForPrimary → primaryContrast, textForSecondary → secondaryContrast,
// textForBlock/text → text, block/container → container, shadow убран

export const HalloweenTheme: ITheme = {
  dark: false,
  statusBarStyle: 'light',
  backgroundGradient: ['#33135b', '#24155c'],
  colors: {
    // Не transparent: системный фон (expo-system-ui) не поддерживает
    // прозрачность, поэтому берём средний тон градиента
    background: '#2c1445',
    primary: '#ff8629',
    secondary: '#6536F2',
    primaryContrast: '#FFFFFF',
    secondaryContrast: '#FFFFFF',
    border: '#6A5787',
    text: '#EDEDED',
    text2: '#B9A8D9',
    inputPlaceholder: '#6A5787',
    container: '#361f7a',
    cards: '#3d2485',
    card: '#33135b',
    notification: '#EAEAEA',
  },
};

export const NewYearTheme: ITheme = {
  dark: false,
  statusBarStyle: 'light',
  backgroundGradient: ['#9b1b2a', '#9b1b2a'],
  colors: {
    background: '#9b1b2a',
    primary: '#FFC63E',
    secondary: '#FFC63E',
    primaryContrast: '#FEFEFE',
    secondaryContrast: '#FEFEFE',
    border: '#7d151f',
    text: '#FFF4DB',
    text2: '#E7C9A0',
    inputPlaceholder: '#B1A796',
    container: '#8a1722',
    cards: '#a82333',
    card: '#9b1b2a',
    notification: '#EAEAEA',
  },
};

export const APP_THEMES = {
  light: LightTheme,
  dark: DarkTheme,
  black: BlackTheme,
  halloween: HalloweenTheme,
  newYear: NewYearTheme,
};

// Тема является событийной (включается автоматически и выключается по окончании события)
export const isEventTheme = (theme: ThemeType) =>
  theme === ThemeType.halloween || theme === ThemeType.newYear;
