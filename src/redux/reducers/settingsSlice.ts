import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LanguagePreference } from '~/i18n';
import { ThemeType } from '~/styles/themes';
import { Events } from '~/utils/events';

export enum TimetableModes {
  days,
  weeks,
}

interface CacheMigrations {
  v1_3_0?: boolean;
  v1_4_0?: boolean;
}

export interface UIConfig {
  timetableMode: TimetableModes;
  showPastWeekDays: boolean;
  highlightCurrentDay: boolean;
  skipSunday: boolean;
  showGapsBetweenPairs: boolean;
  showEmptyPairs: boolean;
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
  language: LanguagePreference;
}

interface SettingsState {
  appIsReady: boolean;
  config: AppConfig;
}

const initialConfig: AppConfig = {
  theme: ThemeType.auto,
  introViewed: false,
  signNotificationEnabled: true,
  sentryEnabled: true,
  events: {},
  ui: {
    timetableMode: TimetableModes.days,
    showPastWeekDays: true,
    highlightCurrentDay: false,
    skipSunday: true,
    showGapsBetweenPairs: false,
    showEmptyPairs: false,
  },
  cacheMigrations: {},
  reviewStep: 'pending',
  privacyPolicyAccepted: false,
  releaseNotesViews: {},
  language: 'system',
};

const initialState: SettingsState = {
  appIsReady: false,
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
    setReviewStep(state, action: PayloadAction<'pending' | 'stop'>) {
      state.config.reviewStep = action.payload;
    },
    setSignNotification(state, action: PayloadAction<boolean>) {
      state.config.signNotificationEnabled = action.payload;
    },
    setAppReady(state, action: PayloadAction<boolean>) {
      state.appIsReady = action.payload;
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
    setLanguage(state, action: PayloadAction<LanguagePreference>) {
      state.config.language = action.payload;
    },
  },
});

export default settingsSlice.reducer;
export const {
  setConfig,
  changeTheme,
  setIntroViewed,
  setReviewStep,
  setSignNotification,
  setAppReady,
  setSentryEnabled,
  setEvents,
  setUIConfig,
  setLanguage,
} = settingsSlice.actions;
