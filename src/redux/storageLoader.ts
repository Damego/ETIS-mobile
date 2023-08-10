import { setUserCredentials } from './reducers/authSlice';
import { setConfig, setAppReady } from './reducers/settingsSlice';
import { AppDispatch } from './store';
import {cache} from '../cache/smartCache';

export const loadSettings = () => async (dispatch: AppDispatch) => {
  const config = await cache.getAppConfig();

  if (!config) return;

  dispatch(setConfig(config));
};

export const loadUserCredentials = () => async (dispatch: AppDispatch) => {
  const userCredentials = await cache.getUserCredentials();

  const payload = {
    userCredentials,
    fromStorage: true
  }
  dispatch(setUserCredentials(payload));
};

export const loadStorage = () => async (dispatch: AppDispatch) => {
  await Promise.all([loadSettings()(dispatch), loadUserCredentials()(dispatch)]);

  dispatch(setAppReady(true));
}
