import * as BackgroundTask from 'expo-background-task';
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
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const difference = differenceSigns(cachedResult.data.subjects, onlineResult.data.subjects);

    if (difference?.length !== 0) {
      console.log('[FETCH] Fetched new data!');
      difference.forEach((checkPoint) => {
        displaySignNotification(checkPoint);
      });
    }

    console.log('[FETCH] Fetched no new data');
    return BackgroundTask.BackgroundTaskResult.Success;
  });

async function registerBackgroundTaskAsync() {
  try {
    const status = await BackgroundTask.getStatusAsync();
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      console.warn('[FETCH] Background task restricted on this device. Skipping.');
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 10 * 60, // 10 minutes
      });
    }
  } catch (err) {
    console.warn('[FETCH] registerTaskAsync failed:', String(err?.message || err));
  }
}

export async function unregisterBackgroundFetchAsync() {
  return BackgroundTask.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export const registerSignsFetchTask = async (session?: number) => {
  client = new Client();
  currentSession = session;

  if (!currentSession) {
    currentSession = (
      await client.getSessionSignsData({ requestType: RequestType.forceCache })
    ).data?.currentSession;
  }

  if (!currentSession) {
    console.warn('[FETCH] Unable to access current session. Task registering canceled.');
    return;
  }
  registerBackgroundTaskAsync().then(() => console.log('[FETCH] Signs fetch task registered'));
};
