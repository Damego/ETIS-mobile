import { useEffect, useRef, useState } from 'react';

import {
  GetResultType, IGetPayload, IGetResult, RequestType
} from '../models/results';
import { setAuthorizing } from '../redux/reducers/accountSlice';
import { useAppDispatch, useAppSelector } from './redux';
import useDebounce from './useDebounce';

type GetMethod<P, R> = (payload: IGetPayload<P>) => Promise<IGetResult<R>>;

interface Query<P, R> {
  // data/initialPayload опциональны: до первого запроса их нет
  data: R | undefined;
  isLoading: boolean;
  refresh: () => void;
  update: (payload?: IGetPayload<P>) => void;
  get: (payload?: IGetPayload<P>) => Promise<IGetResult<R>>;
  initialPayload: P | undefined;
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
  const { isAuthorizing, isOfflineMode } = useAppSelector((state) => state.account);

  const [data, setData] = useState<R>();
  const [isLoading, setLoading] = useState<boolean>(true);
  // Зеркало data для loadData: колбэк и debounce замыкают стейл-значение,
  // а решать «первая загрузка или фоновый refresh» нужно по актуальному наличию данных
  const dataRef = useRef<R | undefined>(undefined);
  const applyData = (value: R) => {
    dataRef.current = value;
    setData(value);
  };

  // isLoading означает только ПЕРВУЮ загрузку (когда данных ещё нет).
  // Повторные загрузки (pull-to-refresh, refresh по focus, update)
  // его не поднимают — экраны с ранним `if (isLoading) return <LoadingScreen>`
  // не должны схлопываться в лоадер при фоновом обновлении.
  const enableLoading = () => {
    if (dataRef.current === undefined) setLoading(true);
  };
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
    const afterReturn = after?.(result);
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
    onFail?.(result);
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
      applyData(result.data);
    }
    disableLoading();
  };

  const debouncedLoadData = useDebounce(loadData, 300);

  const refresh = () =>
    debouncedLoadData({ requestType: RequestType.forceFetch, data: payloadData.current });

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
    update: (payload?) => debouncedLoadData(payload),
    get,
    initialPayload: payloadData.current,
  };
};

export default useQuery;
