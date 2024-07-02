import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ThemeType } from '~/styles/themes';
import { Events } from '~/utils/events';

export enum PageType {
  timeTable = 'Timetable',
  signNavigator = 'SignsNavigator',
  messages = 'Messages',
  announces = 'Announces',
}

export interface CacheMigrations {
  v1_3_0?: boolean;
}

export interface UIConfig {
  showPastWeekDays: boolean;
  highlightCurrentDay: boolean;
}

export interface AppConfig {
  theme: ThemeType;
  signNotificationEnabled: boolean;
  introViewed: boolean;
  reviewStep: 'pending' | 'stop' | null;
  privacyPolicyAccepted: boolean;
  sentryEnabled: boolean;
  events: Events;
  cacheMigrations: CacheMigrations;
  ui: UIConfig;
  releaseNotesViews: { [version: string]: boolean };
}

export interface SettingsState {
  appIsReady: boolean;
  initialPage: PageType;
  config: AppConfig;
}

const initialConfig: AppConfig = {
  theme: ThemeType.auto,
  introViewed: false,
  signNotificationEnabled: true,
  sentryEnabled: true,
  events: {},
  ui: {
    showPastWeekDays: true,
    highlightCurrentDay: false,
  },
  cacheMigrations: {},
  reviewStep: 'pending',
  privacyPolicyAccepted: false,
  releaseNotesViews: {},
};

const initialState: SettingsState = {
  appIsReady: false,
  initialPage: PageType.timeTable,
  config: initialConfig,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<AppConfig>) {
      state.config = { ...initialConfig, ...action.payload };
    },
    changeTheme(state, action: PayloadAction<ThemeType>) {
      state.config.theme = action.payload;
    },
    setIntroViewed(state, action: PayloadAction<boolean>) {
      state.config.introViewed = action.payload;
    },
    setSignNotification(state, action: PayloadAction<boolean>) {
      state.config.signNotificationEnabled = action.payload;
    },
    setAppReady(state, action: PayloadAction<boolean>) {
      state.appIsReady = action.payload;
    },
    setInitialPage(state, action: PayloadAction<PageType>) {
      state.initialPage = action.payload;
    },
    setSentryEnabled(state, action: PayloadAction<boolean>) {
      state.config.sentryEnabled = action.payload;
    },
    setEvents(state, action: PayloadAction<Events>) {
      state.config.events = action.payload;
    },
    setUIConfig(state, action: PayloadAction<Partial<UIConfig>>) {
      state.config.ui = { ...state.config.ui, ...action.payload };
    },
    setReleaseNotes(state, action: PayloadAction<{ [version: string]: boolean }>) {
      state.config.releaseNotesViews = { ...state.config.releaseNotesViews, ...action.payload };
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
  setEvents,
  setUIConfig,
  setReleaseNotes,
} = settingsSlice.actions;
