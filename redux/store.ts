import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authSlice from './reducers/authSlice';
import studentSlice from './reducers/studentSlice';
import timeTableSlice from './reducers/timeTableSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  student: studentSlice,
  timeTable: timeTableSlice,
});

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
