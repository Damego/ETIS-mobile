import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authSlice from './reducers/authSlice';
import settingsSlice from './reducers/settingsSlice';
import signsSlice from './reducers/signsSlice';
import studentSlice from './reducers/studentSlice';
import timeTableSlice from './reducers/timeTableSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  student: studentSlice,
  timeTable: timeTableSlice,
  settings: settingsSlice,
  signs: signsSlice,
});

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
