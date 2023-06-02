import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum ThemeType {
  auto = 'auto',
  light = 'light',
  dark = 'dark',
  amoled = 'amoled',
}

export interface TimeTableState {
  theme: ThemeType;
}

const initialState: TimeTableState = {
  theme: ThemeType.auto,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<ThemeType>) {
        state.theme = action.payload;
    },
  },
});

export default settingsSlice.reducer;
export const { changeTheme} = settingsSlice.actions;