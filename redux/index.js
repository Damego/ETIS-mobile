import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authSlice from './authSlice';
import studentSlice from './studentSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  student: studentSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
