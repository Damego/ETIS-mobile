import { Href, useRouter, useSegments } from 'expo-router';
import { NavigationOptions } from 'expo-router/build/global-state/routing';
import { useAppDispatch } from '~/hooks/redux';
import { setSharedScreenData } from '~/redux/reducers/sharedScreensSlice';

interface IPushCallbackOptions {
  options?: NavigationOptions;
  payload?: unknown;
}

const useAppRouter = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const segments = useSegments();

  const push = (href: Href, opts?: IPushCallbackOptions) => {
    const { options, payload } = opts ?? {};
    // Позволяет передавать данные между экранами посредством redux, так как в expo-router этого делать нельзя, в отличие от react-navigation
    // TODO: Очистка
    if (payload) {
      let pathname = typeof href === 'string' ? href : href.pathname;
      // TODO: Предусмотреть несколько вложенных друг в друга группы и навигаторы
      if (!pathname.startsWith('(') && segments[0].startsWith("(")) {
        pathname = `${segments[0]}/${pathname}`;
      }
      dispatch(
        setSharedScreenData({
          [pathname]: payload,
        })
      );
    }
    router.push(href, options);
  };

  return { ...router, push };
};

export default useAppRouter;
