import { useSegments } from 'expo-router';
import { useAppSelector } from '~/hooks/redux';

const useRoutePayload = <T>(): T => {
  const segments = useSegments();
  const routePath = segments.join('/');

  const data = useAppSelector((state) => state.sharedScreens[routePath]);

  return (data ?? {}) as T;
};

export default useRoutePayload;
