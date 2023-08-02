export enum GetResultType {
  fetched,
  cached,
  error,
  failed,
}

export interface IGetResult<T> {
  type: GetResultType;
  data: T | null;
}

export interface IGetPayload {
  forceFetch: boolean;
  forceCache: boolean;
}

export const errorResult: IGetResult<null> = {
  data: null,
  type: GetResultType.error,
};

export const failedResult: IGetResult<null> = {
  data: null,
  type: GetResultType.failed,
};
