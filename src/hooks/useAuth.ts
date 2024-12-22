import { ToastAndroid } from 'react-native';
import { LoginResponseType, makeLogin } from '~/api/etis/auth';
import { useAppDispatch, useAppSelector } from '~/hooks/redux';
import { setAuthorizing, signIn, signOut } from '~/redux/reducers/accountSlice';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { userCredentials, saveUserCredentials, fromStorage, isSignedIn, isSignedOut } =
    useAppSelector((state) => state.account);

  const login = async (recaptchaToken: string, isInvisibleRecaptcha: boolean) => {
    const { code, message } = await makeLogin(
      recaptchaToken,
      userCredentials,
      saveUserCredentials,
      isInvisibleRecaptcha
    );

    console.log(`[AUTH] ${code} ${message}`);

    if (code === LoginResponseType.rateLimited) {
      ToastAndroid.show(
        'Был превышен лимит (5) неудачных попыток. Повторите через 10 минут!',
        ToastAndroid.SHORT
      );
      dispatch(signOut({}));
    } else if (code === LoginResponseType.invalidUserCredentials) {
      // Данные устарели, поэтому их стоит удалить
      dispatch(signOut({ cleanUserCredentials: true }));
    } else if (code === LoginResponseType.success) {
      dispatch(signIn({}));
    } else if (code === LoginResponseType.failed) {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      signInOffline();
    }

    return code;
  };

  const signInOffline = () => {
    // fromStorage Для проверки, были ли загружены данные из хранилища или нет (пользователь ввёл данные в форме)
    // Возможно, что пользователь вышел из аккаунта или неудачная попытка ввода данных,
    // то нам не нужно заходить в офлайн режим в этих случаях
    // Если же етис недоступен, но данные идут из хранилища, то разрешаем офлайн режим

    if (fromStorage) {
      console.log('[AUTH] Signed in as offline');
      dispatch(signIn({ isOffline: true }));
      dispatch(setAuthorizing(false));
    }
  };

  return { login, signInOffline, isSignedIn, isSignedOut };
};

export default useAuth;
