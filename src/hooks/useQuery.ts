import { useEffect, useRef, useState } from 'react';

import { GetResultType, IGetPayload, IGetResult, RequestType } from '../models/results';
import { setAuthorizing } from '../redux/reducers/authSlice';
import { useAppDispatch, useAppSelector } from './redux';

interface GetMethod<P, R> {
  (payload: IGetPayload<P>): Promise<IGetResult<R>>;
}

interface Query<P, R> {
  data: R;
  isLoading: boolean;
  refresh: () => void;
  update: (payload?: IGetPayload<P>) => void;
  get: (payload?: IGetPayload<P>) => Promise<IGetResult<R>>;
  initialPayload: P;
}

const useQuery = <P, R>({
  method,
  payload: { requestType, data: initialData } = { requestType: RequestType.tryFetch },
  after,
  onFail,
  skipInitialGet,
}: {
  method: GetMethod<P, R>;
  payload?: IGetPayload<P>;
  after?: (result: IGetResult<R>) => void | Promise<void>;
  onFail?: (result: IGetResult<R>) => void;
  skipInitialGet?: boolean;
}): Query<P, R> => {
  const dispatch = useAppDispatch();
  const payloadData = useRef<P>(initialData);
  const skippedInitialGet = useRef<boolean>(false);
  const fromFail = useRef<boolean>(false);
  const calledAuthorizing = useRef<boolean>(false);
  const didInitialGet = useRef<boolean>(false);
  const { isAuthorizing, isOfflineMode } = useAppSelector((state) => state.auth);

  const [data, setData] = useState<R>();
  const [isLoading, setLoading] = useState<boolean>(true);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  useEffect(() => {
    if (skipInitialGet && !skippedInitialGet.current) {
      skippedInitialGet.current = true;
      return;
    }

    // При получении страницы логина, все хуки useQuery в активных экранах
    // начинают делать повторную загрузку данных, что как бы и не нужно,
    // кроме хука, который и получил страницу логина
    if (!calledAuthorizing.current && didInitialGet.current) return;

    // Странная вещь, но после входа, стейт isAuthorizing равен true на экране с расписанием
    if (!isAuthorizing || !didInitialGet.current)
      loadData({ requestType, data: payloadData.current });
    else return;

    if (calledAuthorizing.current) calledAuthorizing.current = false;
    if (!didInitialGet.current) didInitialGet.current = true;
  }, [isAuthorizing]);

  const handleAfter = async (result: IGetResult<R>) => {
    const afterReturn = after(result);
    if (afterReturn instanceof Promise) {
      await afterReturn;
    }
  };

  const handleFailedQuery = (result: IGetResult<R>) => {
    if (fromFail.current) {
      console.warn('[QUERY] Recursion caught. Ignoring next calling');
      return;
    }
    fromFail.current = true;
    onFail(result);
    fromFail.current = false;
  };

  const checkLoginPage = (result: IGetResult<R>) => {
    if (result.type === GetResultType.loginPage) {
      calledAuthorizing.current = true;
      dispatch(setAuthorizing(true));
    }
  };

  const loadData = async (payload?: IGetPayload<P>) => {
    enableLoading();

    const result = await get(payload);

    if (result.type === GetResultType.loginPage) return;

    if (!result.data) {
      if (onFail) handleFailedQuery(result);
    } else {
      if (after) await handleAfter(result);
      setData(result.data);
    }
    disableLoading();
  };

  const refresh = () =>
    loadData({ requestType: RequestType.forceFetch, data: payloadData.current });

  const get = async (payload?: IGetPayload<P>): Promise<IGetResult<R>> => {
    payload = payload || { requestType, data: payloadData.current };
    if (isOfflineMode) {
      payload.requestType = RequestType.forceCache;
    }
    payloadData.current = payload.data;

    const result = await method(payload);

    checkLoginPage(result);
    return result;
  };

  return {
    data,
    isLoading,
    refresh,
    update: (payload?) => loadData(payload),
    get,
    initialPayload: payloadData.current,
  };
};

export default useQuery;
