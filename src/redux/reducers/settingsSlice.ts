import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum ThemeType {
  auto = 'auto',
  light = 'light',
  dark = 'dark',
  amoled = 'amoled',
}

export interface SettingsState {
  theme: ThemeType;
  viewedIntro: boolean;
}

const initialState: SettingsState = {
  theme: ThemeType.auto,
  viewedIntro: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<ThemeType>) {
      state.theme = action.payload;
    },
    setIntroViewed(state, action: PayloadAction<boolean>) {
      state.viewedIntro = action.payload;
    },
  },
});

export default settingsSlice.reducer;
export const { changeTheme, setIntroViewed } = settingsSlice.actions;
