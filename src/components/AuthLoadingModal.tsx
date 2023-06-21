import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import React, { useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, ToastAndroid, View } from 'react-native';

import { useAppDispatch, useAppSelector, useGlobalStyles } from '../hooks';
import { UserCredentials, setAuthorizing, signIn } from '../redux/reducers/authSlice';
import { httpClient, storage } from '../utils';
import ReCaptcha from './ReCaptcha';

const styles = StyleSheet.create({
  modalWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    padding: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

enum LoginResponseType {
  missingToken,
  invalidToken,
  success,
  failed,
  privacyPolicyNotAccepted
}

const makeLogin = async (
  token: string,
  userCredentials: UserCredentials,
  saveUserCredentials: boolean
): Promise<LoginResponseType> => {
  if (!token) {
    return LoginResponseType.missingToken;
  }
  if (!(await storage.hasAcceptedPrivacyPolicy())) return LoginResponseType.privacyPolicyNotAccepted;

  const response = await httpClient.login(userCredentials.login, userCredentials.password, token);

  if (response && response.error) {
    if (response.error.message === 'Вы не прошли проверку') return LoginResponseType.invalidToken;

    ToastAndroid.show(response.error.message, ToastAndroid.SHORT);
    return LoginResponseType.failed;
  }

  if (saveUserCredentials) {
    await storage.storeAccountData(userCredentials.login, userCredentials.password);
  }
  return LoginResponseType.success;
};

const AuthLoadingModal = () => {
  const dispatch = useAppDispatch();
  const { userCredentials, saveUserCredentials, fromStorage } = useAppSelector(
    (state) => state.auth
  );
  const recaptchaRef = useRef<ReCaptchaV3>();

  const globalStyles = useGlobalStyles();

  const onReceiveToken = async (token: string) => {
    const success = await makeLogin(token, userCredentials, saveUserCredentials);
    if (success === LoginResponseType.missingToken || success === LoginResponseType.invalidToken) {
      recaptchaRef.current.refreshToken();
      return;
    }
    if (success === LoginResponseType.privacyPolicyNotAccepted) return;

    if (success === LoginResponseType.success) {
      dispatch(signIn({}));
    }
    if (success === LoginResponseType.failed) {
      // fromStorage Для проверки, были ли загружены данные из хранилища или нет (т.е. пользователь ввёл данные в форме)
      // Возможно, что пользователь вышел из аккаунта или неудачная попытка ввода данных,
      // то нам не нужно заходить в оффлайн режим в этих случаях
      // Если же етис недоступен, но данные идут из хранилища, то разрешаем оффлайн режим

      // Есть небольшая уязвимость, если пользователь сменит пароль, то приложение всё равно войдёт в оффлайн режим
      // при недоступности етиса или интернета
      if (fromStorage) {
        console.log('[AUTH] Signed in as offline');
        dispatch(signIn({ isOffline: true }));
      }
    }

    dispatch(setAuthorizing(false));
  };

  return (
    <View style={styles.modalWrapper}>
      <View
        style={[
          styles.modalContainer,
          globalStyles.border,
          globalStyles.block,
          globalStyles.shadow,
        ]}
      >
        <ReCaptcha onReceiveToken={onReceiveToken} captchaRef={recaptchaRef} />
        <ActivityIndicator size="large" color={globalStyles.primaryFontColor.color} />
        <Text style={globalStyles.textColor}>Авторизация...</Text>
      </View>
    </View>
  );
};

export default AuthLoadingModal;
