import { useCallback, useEffect, useRef } from 'react';

type AnyFunction = (...args: any[]) => void;

const useDebounce = <T extends AnyFunction>(callback: T, delay: number): T => {
  const callbackRef = useRef<T>(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
      timeoutRef.current = undefined;
    }, delay);
  }, [delay]) as T;
};

export default useDebounce;
