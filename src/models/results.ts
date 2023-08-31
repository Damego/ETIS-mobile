/*
 * fetched - данные получены только что
 * cached - используются кешированные данные
 * error - нет данных для отображения
 * failed - данные получены, но они не поддаются парсингу
 * loginPage - получена страница авторизации
 */
export enum GetResultType {
  fetched,
  cached,
  error,
  failed,
  loginPage,
}

/*
  forceCache - используются только кешированные данные
  tryFetch - сначала происходит запрос данных, при неудаче - используется кеш
  forceFetch - происходит запрос данных
 */
export enum RequestType {
  forceCache,
  tryCache,
  tryFetch,
  forceFetch,
}
export interface IGetResult<T> {
  type: GetResultType;
  data: T | null;
}

export interface IGetPayload {
  requestType: RequestType;
}

export const errorResult: IGetResult<null> = {
  data: null,
  type: GetResultType.error,
};

export const failedResult: IGetResult<null> = {
  data: null,
  type: GetResultType.failed,
};

export const loginPageResult: IGetResult<null> = {
  data: null,
  type: GetResultType.loginPage,
};
