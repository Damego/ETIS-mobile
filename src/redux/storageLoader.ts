import { storage } from '../utils';
import { UserCredentials, setUserCredentials } from './reducers/authSlice';
import { changeTheme, setAppReady, setIntroViewed, setSignNotification } from './reducers/settingsSlice';
import { AppDispatch } from './store';

export const loadSettings = () => async (dispatch: AppDispatch) => {
  const [theme, hasViewedIntro, signNotification] = await Promise.all([
    storage.getAppTheme(),
    storage.hasViewedIntro(),
    storage.getSignNotification(),
  ]);

  dispatch(changeTheme(theme));
  dispatch(setIntroViewed(hasViewedIntro));
  dispatch(setSignNotification(signNotification));
};

export const loadUserCredentials = () => async (dispatch: AppDispatch) => {
  const userCredentials: UserCredentials = await storage.getAccountData();
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
