import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import React, { useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, ToastAndroid, View } from 'react-native';

import { useAppDispatch, useAppSelector, useGlobalStyles } from '../hooks';
import { setAuthorizing, signIn, UserCredentials } from '../redux/reducers/authSlice';
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

const makeLogin = async (token: string, userCredentials: UserCredentials, saveUserCredentials: boolean): Promise<boolean | null> => {
  if (!token) {
    return null;
  }
  const response = await httpClient.login(
    userCredentials.login,
    userCredentials.password,
    token
  );

  if (response && response.error) {
    if (response.error.message === 'Вы не прошли проверку') return null;

    ToastAndroid.show(response.error.message, ToastAndroid.SHORT);
    return false;
  }

  if (saveUserCredentials) {
    await storage.storeAccountData(userCredentials.login, userCredentials.password);
  }
  return true;
};

const AuthLoadingModal = () => {
  const dispatch = useAppDispatch();
  const { userCredentials, saveUserCredentials, fromStorage } = useAppSelector((state) => state.auth);
  const recaptchaRef = useRef<ReCaptchaV3>();

  const globalStyles = useGlobalStyles();

  const onReceiveToken = async (token: string) => {
    const success = await makeLogin(token, userCredentials, saveUserCredentials);
    if (success === null) {
      recaptchaRef.current.refreshToken();
      return;
    }
    if (success === true) {
      dispatch(signIn({}));
    }

    // fromStorage Для проверки, были ли загружены данные из хранилища или нет
    // Возможно, что если етис недоступен и пользователь вышел из аккаунта, то нам не нужно заходить в оффлайн режим
    if (fromStorage) {
      console.log("[AUTH] Signed in as offline");
      dispatch(signIn({isOffline: true}));
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
