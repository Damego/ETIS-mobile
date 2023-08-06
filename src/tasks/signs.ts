import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { getPartialSignsData } from '../data/signs';
import { ICheckPoint, ISubject } from '../models/sessionPoints';
import { sendNewMarkNotification } from '../utils/notifications';
import { GetResultType, RequestType } from '../models/results';

const BACKGROUND_FETCH_TASK = 'signs-fetch';
let currentSession;

interface IDifferentCheckPoint {
  oldResult: ICheckPoint;
  newResult: ICheckPoint;
  subjectName: string;
}

const differenceSigns = (marks1: ISubject[], marks2: ISubject[]) => {
  if (marks1.length !== marks2.length) {
    return [];
  }

  return marks2
    .map((newRes) => {
      const oldRes = marks1.find((subject) => subject.name === newRes.name);
      if (!oldRes || newRes.checkPoints.length !== oldRes.checkPoints.length) return [];

      const diffCheckPoints: IDifferentCheckPoint[] = newRes.checkPoints
        .map((checkPoint, i) => {
          if (checkPoint.points !== oldRes.checkPoints[i].points) {
            return {
              newResult: checkPoint,
              oldResult: oldRes.checkPoints[i],
              subjectName: newRes.name,
            };
          }
          return null;
        })
        .filter((s) => s !== null);

      return diffCheckPoints;
    })
    .filter((s) => s.length !== 0)
    .flat();
};

export const defineFetchTask = () =>
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const [cachedResult, onlineResult] = await Promise.all([
      await getPartialSignsData({ session: currentSession, requestType: RequestType.forceCache }),
      await getPartialSignsData({ session: currentSession, requestType: RequestType.forceFetch }),
    ]);
    let result;

    if (onlineResult.type === GetResultType.loginPage) {
      console.log('[FETCH] Token is expired. Canceling fetch...'); // TODO: re-actualize token
      unregisterBackgroundFetchAsync();
      result = BackgroundFetch.BackgroundFetchResult.Failed;
    } else {
      const difference =
        cachedResult.type === GetResultType.fetched
          ? differenceSigns(cachedResult.data.subjects, onlineResult.data.subjects)
          : onlineResult.data.subjects;

      if (difference !== null) {
        console.log('[FETCH] Fetched new data!');
        difference.map((checkPoint) => {
          sendNewMarkNotification(
            checkPoint.subjectName,
            checkPoint.newResult.theme,
            checkPoint.oldResult.points,
            checkPoint.newResult.points
          );
        });
        result = BackgroundFetch.BackgroundFetchResult.NewData;
      } else {
        console.log('[FETCH] Fetched no new data');
        result = BackgroundFetch.BackgroundFetchResult.NoData;
      }
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

export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export const registerFetch = async () => {
  currentSession = (await getPartialSignsData({ requestType: RequestType.forceFetch })).data
    .currentSession;
  registerBackgroundFetchAsync().then(() => console.log('[FETCH] Signs fetch task registered'));
};
