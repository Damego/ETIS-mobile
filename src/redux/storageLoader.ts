import { cache } from '~/cache/smartCache';

import { setUserCredentials } from './reducers/authSlice';
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

export const loadStorage = () => async (dispatch: AppDispatch) => {
  await Promise.all([loadSettings()(dispatch), loadUserCredentials()(dispatch)]);

  dispatch(setAppReady(true));
};
