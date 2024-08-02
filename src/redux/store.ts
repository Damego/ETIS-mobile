import { combineReducers, configureStore } from '@reduxjs/toolkit';

import accountSlice from './reducers/accountSlice';
import settingsSlice from './reducers/settingsSlice';
import studentSlice from './reducers/studentSlice';

const rootReducer = combineReducers({
  account: accountSlice,
  student: studentSlice,
  settings: settingsSlice,
});

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
