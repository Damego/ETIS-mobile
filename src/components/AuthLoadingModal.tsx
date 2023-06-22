import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, ToastAndroid, View } from 'react-native';

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
    height: '25%',
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

enum LoginResponseType {
  missingToken,
  invalidToken,
  success,
  failed,
  privacyPolicyNotAccepted,
  invalidUserCredentials,
  rateLimited,
}

const makeLogin = async (
  token: string,
  userCredentials: UserCredentials,
  saveUserCredentials: boolean
): Promise<LoginResponseType> => {
  if (!token) {
    return LoginResponseType.missingToken;
  }
  if (!(await storage.hasAcceptedPrivacyPolicy()))
    return LoginResponseType.privacyPolicyNotAccepted;

  const response = await httpClient.login(userCredentials.login, userCredentials.password, token);

  if (response && response.error) {
    // У нас нет других вариантов проверять тип ошибки
    const message: string = response.error.message.toLowerCase();

    if (message.includes('проверк')) return LoginResponseType.invalidToken;

    if (message.includes('лимит')) {
      ToastAndroid.show(
        'Был превышен лимит (5) неудачных попыток. Повторите через 10 минут!',
        ToastAndroid.SHORT
      );
      return LoginResponseType.rateLimited;
    }

    ToastAndroid.show(response.error.message, ToastAndroid.SHORT);

    if (message.includes('неверное')) return LoginResponseType.invalidUserCredentials;

    return LoginResponseType.failed;
  }

  if (saveUserCredentials) {
    await storage.storeAccountData(userCredentials.login, userCredentials.password);
  }
  return LoginResponseType.success;
};

const AuthLoadingModal = () => {
  const dispatch = useAppDispatch();
  const { userCredentials, saveUserCredentials, fromStorage, isAuthorizing } = useAppSelector(
    (state) => state.auth
  );
  const [showOfflineButton, setShowOfflineButton] = useState<boolean>(false);

  const recaptchaRef = useRef<ReCaptchaV3>();

  const globalStyles = useGlobalStyles();

  const onReceiveToken = async (token: string) => {
    const response = await makeLogin(token, userCredentials, saveUserCredentials);
    if (
      response === LoginResponseType.missingToken ||
      response === LoginResponseType.invalidToken
    ) {
      recaptchaRef.current.refreshToken();
      return;
    }
    if (response === LoginResponseType.success) {
      dispatch(signIn({}));
    }

    if (response === LoginResponseType.failed) {
      // fromStorage Для проверки, были ли загружены данные из хранилища или нет (т.е. пользователь ввёл данные в форме)
      // Возможно, что пользователь вышел из аккаунта или неудачная попытка ввода данных,
      // то нам не нужно заходить в оффлайн режим в этих случаях
      // Если же етис недоступен, но данные идут из хранилища, то разрешаем оффлайн режим

      // Есть небольшая уязвимость, если пользователь сменит пароль, то приложение всё равно войдёт в оффлайн режим
      // при недоступности етиса или интернета
      signInOffline();
    }

    dispatch(setAuthorizing(false));
  };

  useEffect(() => {
    httpClient.isInternetReachable().then(res => {
      if (!res) signInOffline();
    });

    // Если интернет есть, но он очень медленный
    setTimeout(() => {
      if (!isAuthorizing) return;
      setShowOfflineButton(true);
    }, 5000);
  }, []);

  const signInOffline = () => {
    if (fromStorage) {
      console.log('[AUTH] Signed in as offline');
      dispatch(signIn({ isOffline: true }));
      dispatch(setAuthorizing(false));
    }
  };

  return (
    <View style={styles.modalWrapper}>
      <ReCaptcha onReceiveToken={onReceiveToken} captchaRef={recaptchaRef} />
      <View
        style={[
          styles.modalContainer,
          globalStyles.border,
          globalStyles.block,
          globalStyles.shadow,
        ]}
      >
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color={globalStyles.primaryFontColor.color} />
          <Text style={globalStyles.textColor}>Авторизация...</Text>

          {showOfflineButton && (
            <View style={{ marginTop: '15%' }}>
              <Button
                title="Оффлайн режим"
                onPress={signInOffline}
                color={globalStyles.primaryFontColor.color}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default AuthLoadingModal;
