import { useEffect, useRef, useState } from 'react';

import { GetResultType, IGetPayload, IGetResult, RequestType } from '../models/results';
import { setAuthorizing } from '../redux/reducers/authSlice';
import { ErrorCode, HTTPError } from '../utils/http';
import { useAppDispatch, useAppSelector } from './redux';

interface getMethod<P, R> {
  (payload: IGetPayload<P>): Promise<IGetResult<R>>;
}

interface useQueryReturn<P, R> {
  data: R,
  isLoading: boolean;
  error: HTTPError;
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
  payload = payload || {requestType: RequestType.tryFetch}

  const dispatch = useAppDispatch();
  const payloadData = useRef<P>(payload.data)
  const { isAuthorizing } = useAppSelector((state) => state.auth);

  const [data, setData] = useState<R>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<HTTPError>();

  useEffect(() => {
    console.log("[QUERY] Handle useEffect hook")
    if (!isAuthorizing) loadData(payload);
  }, [isAuthorizing]);

  const loadData = async (payload: IGetPayload<P>) => {
    setLoading(true);
    payloadData.current = payload.data;
    const result = await method(payload);
    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (after) {
      const afterReturn = after(result);
      if (afterReturn instanceof Promise) {
        await afterReturn;
      }
    }

    if (!result.data) {
      setError({ code: ErrorCode.unknown, message: 'no data' });
      if (onFail) onFail(result);
    } else {
      setData(result.data);
    }
    setLoading(false);


  };

  const refresh = () => loadData({ requestType: RequestType.forceFetch, data: payloadData.current });

  return {
    data,
    isLoading,
    error,
    refresh,
    update: (payload) => loadData(payload)
  };
};

export default useQuery;
