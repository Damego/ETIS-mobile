import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum ThemeType {
  auto = 'auto',
  light = 'light',
  dark = 'dark',
  amoled = 'amoled',
}

export interface AppConfig {
  theme: ThemeType;
  signNotificationEnabled: boolean;
  introViewed: boolean;
  reviewStep: 'pending' | 'stop' | null;
  privacyPolicyAccepted: boolean;
}

export interface SettingsState {
  theme: ThemeType;
  viewedIntro: boolean;
  signNotification: boolean;
  appIsReady: boolean;
}

const initialState: SettingsState = {
  theme: ThemeType.auto,
  viewedIntro: false,
  signNotification: true,
  appIsReady: false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<AppConfig>) {
      const config = action.payload;
      if (config.theme !== undefined) state.theme = config.theme;
      else state.theme = ThemeType.auto;

      if (config.signNotificationEnabled !== undefined) state.signNotification = config.signNotificationEnabled;
      else state.signNotification = false;

      if (config.introViewed !== undefined) state.viewedIntro = config.introViewed;
      else state.viewedIntro = false;
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
    }
  },
});

export default settingsSlice.reducer;
export const { setConfig, changeTheme, setIntroViewed, setSignNotification, setAppReady } = settingsSlice.actions;
