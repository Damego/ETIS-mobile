import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { getPartialSignsData } from '../data/signs';
import { ISubject } from '../models/sessionPoints';

const BACKGROUND_FETCH_TASK = 'signs-fetch';
let currentSession;

const differenceSigns = (marks1: ISubject[], marks2: ISubject[]) => {
  // TODO
};
export const defineFetchTask = () =>
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const [cachedResult, onlineResult] = await Promise.all([
      await getPartialSignsData({ session: currentSession, useCacheFirst: true }),
      await getPartialSignsData({ useCache: false }),
    ]);
    let result;

    if (onlineResult.isLoginPage) {
      console.log('[FETCH] Token is expired. Canceling fetch...'); // TODO: re-actualize token
      unregisterBackgroundFetchAsync();
      result = BackgroundFetch.BackgroundFetchResult.Failed;
    }
    const difference = differenceSigns(cachedResult.data.subjects, onlineResult.data.subjects);

    if (difference !== null) {
      console.log('[FETCH] Fetched new data!');
      // TODO: send notification
      result = BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      console.log('[FETCH] Fetched no new data');
      result = BackgroundFetch.BackgroundFetchResult.NoData;
    }
    return result;
  });
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 10 * 60, // 10 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: false, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export const registerFetch = async () => {
  currentSession = (await getPartialSignsData({ useCache: false })).data.currentSession;
  registerBackgroundFetchAsync().then(() => console.log('[FETCH] Signs fetch task registered'));
};
