import { storage } from '../utils';
import { UserCredentials, setUserCredentials } from './reducers/authSlice';
import { changeTheme, setIntroViewed, setSignNotification } from './reducers/settingsSlice';
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
  const payload: UserCredentials = await storage.getAccountData();
  dispatch(setUserCredentials(payload));
};
