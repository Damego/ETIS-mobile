import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum ThemeType {
  auto = 'auto',
  light = 'light',
  dark = 'dark',
  black = 'black',
}

export enum PageType {
  timeTable = 'Timetable',
  signNavigator = 'SignsNavigator',
  messages = 'Messages',
  announces = 'Announces',
}

export interface AppConfig {
  theme: ThemeType;
  signNotificationEnabled: boolean;
  introViewed: boolean;
  reviewStep: 'pending' | 'stop' | null;
  privacyPolicyAccepted: boolean;
  sentryEnabled: boolean;
}

export interface SettingsState {
  theme: ThemeType;
  viewedIntro: boolean;
  signNotification: boolean;
  appIsReady: boolean;
  initialPage: PageType;
  sentryEnabled: boolean;
}

const initialState: SettingsState = {
  theme: ThemeType.auto,
  viewedIntro: false,
  signNotification: true,
  appIsReady: false,
  initialPage: PageType.timeTable,
  sentryEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<AppConfig>) {
      const config = action.payload;
      if (config.theme !== undefined) state.theme = config.theme;
      else state.theme = ThemeType.auto;

      if (config.signNotificationEnabled !== undefined)
        state.signNotification = config.signNotificationEnabled;
      else state.signNotification = false;

      if (config.introViewed !== undefined) state.viewedIntro = config.introViewed;
      else state.viewedIntro = false;

      if (config.sentryEnabled !== undefined) state.sentryEnabled = config.sentryEnabled;
      else state.sentryEnabled = true;
    },
    changeTheme(state, action: PayloadAction<ThemeType>) {
      state.theme = action.payload;
    },
    setIntroViewed(state, action: PayloadAction<boolean>) {
      state.viewedIntro = action.payload;
    },
    setSignNotification(state, action: PayloadAction<boolean>) {
      state.signNotification = action.payload;
    },
    setAppReady(state, action: PayloadAction<boolean>) {
      state.appIsReady = action.payload;
    },
    setInitialPage(state, action: PayloadAction<PageType>) {
      state.initialPage = action.payload;
    },
    setSentryEnabled(state, action: PayloadAction<boolean>) {
      state.sentryEnabled = action.payload;
    },
  },
});

export default settingsSlice.reducer;
export const {
  setConfig,
  changeTheme,
  setIntroViewed,
  setSignNotification,
  setAppReady,
  setInitialPage,
  setSentryEnabled,
} = settingsSlice.actions;
