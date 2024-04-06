import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect } from 'react';

import { cache } from '../cache/smartCache';
import { useAppDispatch, useAppSelector } from './index';
import { RootStackNavigationProp } from '../navigation/types';
import { setReleaseNotes } from '../redux/reducers/settingsSlice';

/*
Возвращает текущую версию приложения без патч версии
*/
const getAppVersion = () => {
  const appVersion = Constants.expoConfig.version;
  const [major, minor] = appVersion.split('.');
  return `${major}.${minor}`;
};

const useReleaseNotes = () => {
  const { releaseNotesViews } = useAppSelector((state) => state.settings.config);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    const appVersion = getAppVersion();
    console.log(appVersion);
    if (!releaseNotesViews[appVersion]) {
      console.log('not viewed');
      navigation.navigate('ReleaseNotes');
      const payload = { [appVersion]: true };
      dispatch(setReleaseNotes(payload));
      cache.setReleaseNotesViews(payload);
    }
  }, []);

  return null;
};

export default useReleaseNotes;
