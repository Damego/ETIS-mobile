import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { BaseClient } from '~/data/base';
import Client from '~/data/client';
import { GetResultType, RequestType } from '~/models/results';
import { displaySignNotification } from '~/notifications/signs';

import { differenceSigns } from './math';

const BACKGROUND_FETCH_TASK = 'signs-fetch';
let currentSession: number;
let client: BaseClient;

export const defineSignsFetchTask = () =>
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const [cachedResult, onlineResult] = await Promise.all([
      client.getSessionSignsData({
        data: currentSession,
        requestType: RequestType.forceCache,
      }),
      client.getSessionSignsData({
        data: currentSession,
        requestType: RequestType.forceFetch,
      }),
    ]);

    if (onlineResult.type === GetResultType.loginPage) {
      console.log('[FETCH] Token is expired. Canceling fetch...'); // TODO: re-actualize token
      unregisterBackgroundFetchAsync();
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    const difference = differenceSigns(cachedResult.data.subjects, onlineResult.data.subjects);

    if (difference?.length !== 0) {
      console.log('[FETCH] Fetched new data!');
      difference.forEach((checkPoint) => {
        displaySignNotification(checkPoint);
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    console.log('[FETCH] Fetched no new data');
    return BackgroundFetch.BackgroundFetchResult.NoData;
  });

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 10 * 60, // 10 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: false, // android only
  });
}

export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export const registerSignsFetchTask = async () => {
  client = new Client();
  currentSession = (await client.getSessionSignsData({ requestType: RequestType.forceFetch })).data
    ?.currentSession;

  if (!currentSession) {
    console.warn('[FETCH] Unable to access current session. Task registering canceled.');
    return;
  }
  registerBackgroundFetchAsync().then(() => console.log('[FETCH] Signs fetch task registered'));
};
