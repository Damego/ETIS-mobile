import { useEffect, useRef, useState } from 'react';

import { GetResultType, IGetPayload, IGetResult, RequestType } from '../models/results';
import { setAuthorizing } from '../redux/reducers/authSlice';
import { useAppDispatch, useAppSelector } from './redux';

interface getMethod<P, R> {
  (payload: IGetPayload<P>): Promise<IGetResult<R>>;
}

interface Query<P, R> {
  data: R;
  isLoading: boolean;
  refresh: () => void;
  update: (payload: IGetPayload<P>) => void;
  get: (payload: IGetPayload<P>) => Promise<IGetResult<R>>
}

const useQuery = <P, R>({
  method,
  payload,
  after,
  onFail,
  skipInitialGet
}: {
  method: getMethod<P, R>;
  payload?: IGetPayload<P>;
  after?: (result: IGetResult<R>) => void | Promise<void>;
  onFail?: (result: IGetResult<R>) => void;
  skipInitialGet?: boolean;
}): Query<P, R> => {
  payload = payload || { requestType: RequestType.tryFetch };

  const dispatch = useAppDispatch();
  const payloadData = useRef<P>(payload.data);
  const skippedInitialGet = useRef<boolean>(false)
  const fromFail = useRef<boolean>(false);
  const { isAuthorizing } = useAppSelector((state) => state.auth);

  const [data, setData] = useState<R>();
  const [isLoading, setLoading] = useState<boolean>(true);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  useEffect(() => {
    if (skipInitialGet && !skippedInitialGet.current) {
      skippedInitialGet.current = true;
      return;
    }
    if (!isAuthorizing) loadData(payload);
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
      dispatch(setAuthorizing(true));
      return true;
    }
    return false;
  }

  const loadData = async (payload: IGetPayload<P>) => {
    enableLoading();

    const result = await get(payload);

    if (after) await handleAfter(result);
    if (!result.data) {
      if (onFail) handleFailedQuery(result);
    } else {
      setData(result.data);
    }
    disableLoading();
  };

  const refresh = () =>
    loadData({ requestType: RequestType.forceFetch, data: payloadData.current });

  const get = async (payload: IGetPayload<P>): Promise<IGetResult<R>> => {
    payloadData.current = payload.data;
    const result = await method(payload);

    if (checkLoginPage(result)) return;
    return result;
  }

  return {
    data,
    isLoading,
    refresh,
    update: (payload) => loadData(payload),
    get
  };
};

export default useQuery;
