export interface IGetResult<T> {
  data?: T;
  isLoginPage?: boolean;
  fetched?: boolean;
}

export interface IGetPayload {
  useCache?: boolean;
  useCacheFirst?: boolean;
}

export const emptyResult: IGetResult<null> = {
  data: null,
  isLoginPage: false,
  fetched: false
}