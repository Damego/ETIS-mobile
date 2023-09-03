import { useEffect, useRef, useState } from 'react';

import { GetResultType, IGetPayload, IGetResult, RequestType } from '../models/results';
import { setAuthorizing } from '../redux/reducers/authSlice';
import { useAppDispatch, useAppSelector } from './redux';

interface getMethod<P, R> {
  (payload: IGetPayload<P>): Promise<IGetResult<R>>;
}

interface useQueryReturn<P, R> {
  data: R;
  isLoading: boolean;
  refresh: () => void;
  update: (payload: IGetPayload<P>) => void;
}

const useQuery = <P, R>({
  method,
  payload,
  after,
  onFail,
}: {
  method: getMethod<P, R>;
  payload?: IGetPayload<P>;
  after?: (result: IGetResult<R>) => void | Promise<void>;
  onFail?: (result: IGetResult<R>) => void;
}): useQueryReturn<P, R> => {
  payload = payload || { requestType: RequestType.tryFetch };

  const dispatch = useAppDispatch();
  const payloadData = useRef<P>(payload.data);
  const fromFail = useRef<boolean>(false);
  const { isAuthorizing } = useAppSelector((state) => state.auth);

  const [data, setData] = useState<R>();
  const [isLoading, setLoading] = useState<boolean>(true);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  useEffect(() => {
    console.log('[QUERY] Handle useEffect hook');
    if (!isAuthorizing) loadData(payload);
  }, [isAuthorizing]);

  const handleAfter = async (result: IGetResult<R>) => {
    const afterReturn = after(result);
    if (afterReturn instanceof Promise) {
      await afterReturn;
    }
  };

  const handleOnFail = (result: IGetResult<R>) => {
    if (fromFail) {
      console.warn('[QUERY] Recursion caught. Ignoring next calling');
      return;
    }
    fromFail.current = true;
    onFail(result);
    fromFail.current = false;
  };

  const loadData = async (payload: IGetPayload<P>) => {
    enableLoading();

    payloadData.current = payload.data;
    const result = await method(payload);
    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (after) await handleAfter(result);

    if (!result.data) {
      if (onFail) handleOnFail(result);
    } else {
      setData(result.data);
    }
    disableLoading();
  };

  const refresh = () =>
    loadData({ requestType: RequestType.forceFetch, data: payloadData.current });

  return {
    data,
    isLoading,
    refresh,
    update: (payload) => loadData(payload),
  };
};

export default useQuery;
