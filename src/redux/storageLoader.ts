import { storage } from '../utils';
import { UserCredentials, setUserCredentials } from './reducers/authSlice';
import { changeTheme, setIntroViewed } from './reducers/settingsSlice';
import { AppDispatch } from './store';

export const loadSettings = () => async (dispatch: AppDispatch) => {
  const [theme, hasViewedIntro] = await Promise.all([
    storage.getAppTheme(),
    storage.hasViewedIntro(),
  ]);

  dispatch(changeTheme(theme));
  dispatch(setIntroViewed(hasViewedIntro));
};

export const loadUserCredentials = () => async (dispatch: AppDispatch) => {
  const payload: UserCredentials = await storage.getAccountData();
  dispatch(setUserCredentials(payload));
};
