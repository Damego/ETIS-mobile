import { cache } from '~/cache/smartCache';

import { setStudent, setTeacher, setUserCredentials } from './reducers/accountSlice';
import { setAppReady, setConfig } from './reducers/settingsSlice';
import { AppDispatch } from './store';

export const loadSettings = () => async (dispatch: AppDispatch) => {
  const config = await cache.getAppConfig();

  if (!config) return;

  dispatch(setConfig(config));
};

export const loadUserCredentials = () => async (dispatch: AppDispatch) => {
  let userCredentials = await cache.getUserCredentials();

  // TODO: Remove in the future
  if (!userCredentials) {
    userCredentials = await cache.migrateLegacyUserCredentials();
  }

  const payload = {
    userCredentials,
    fromStorage: true,
  };
  dispatch(setUserCredentials(payload));
};

export const loadAccount = () => async (dispatch: AppDispatch) => {
  const data = await cache.getAccountData();

  if (!data) return;
  if (data.teacher) dispatch(setTeacher(data.teacher));
  if (data.student) dispatch(setStudent(data.student));
};

export const loadStorage = () => async (dispatch: AppDispatch) => {
  await Promise.all([
    loadSettings()(dispatch),
    loadUserCredentials()(dispatch),
    loadAccount()(dispatch),
  ]);

  dispatch(setAppReady(true));
};
