import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useEffect } from 'react';

import { cache } from '../cache/smartCache';
import { RootStackNavigationProp } from '../navigation/types';
import { setReleaseNotes } from '../redux/reducers/settingsSlice';
import { useAppDispatch, useAppSelector } from './index';

/*
Возвращает текущую версию приложения без патч версии.
Возвращает null, если текущая версия - бета
*/
const getAppVersion = () => {
  const appVersion = Constants.expoConfig.version;
  if (appVersion.includes('beta')) return null;

  const [major, minor] = appVersion.split('.');
  return `${major}.${minor}`;
};

const useReleaseNotes = () => {
  const { releaseNotesViews } = useAppSelector((state) => state.settings.config);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    const appVersion = getAppVersion();
    if (appVersion && !releaseNotesViews[appVersion]) {
      navigation.navigate('ReleaseNotes');
      const payload = { [appVersion]: true };
      dispatch(setReleaseNotes(payload));
      cache.setReleaseNotesViews(payload);
    }
  }, []);

  return null;
};

export default useReleaseNotes;
