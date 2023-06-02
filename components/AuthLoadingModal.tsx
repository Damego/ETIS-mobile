import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import React, { MutableRefObject, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, ToastAndroid, View } from 'react-native';

import { useAppDispatch, useAppSelector, useGlobalStyles } from '../hooks';
import { setAuthorizing, signIn } from '../redux/reducers/authSlice';
import { httpClient, storage } from '../utils';

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

const makeLogin = async (token, userCredentials, saveUserCredentials): Promise<boolean | null> => {
  if (!token) {
    return null;
  }
  const { errorMessage } = await httpClient.login(
    userCredentials.login,
    userCredentials.password,
    token
  );

  if (errorMessage) {
    if (errorMessage === 'Вы не прошли проверку') return null;

    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    return false;
  }

  if (saveUserCredentials) {
    await storage.storeAccountData(userCredentials.login, userCredentials.password);
  }
  return true;
};

const AuthLoadingModal = () => {
  const dispatch = useAppDispatch();
  const { userCredentials, saveUserCredentials } = useAppSelector((state) => state.auth);
  const recaptchaRef: MutableRefObject<ReCaptchaV3> = useRef();

  const globalStyles = useGlobalStyles();

  const onReceiveToken = async (token: string) => {
    const success = await makeLogin(token, userCredentials, saveUserCredentials);
    if (success === null) {
      recaptchaRef.current.refreshToken();
      return;
    }
    if (success === true) {
      dispatch(signIn());
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
        <ReCaptchaV3
          ref={recaptchaRef}
          action="submit"
          captchaDomain="https://student.psu.ru"
          siteKey="6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"
          onReceiveToken={onReceiveToken}
        />
        <ActivityIndicator size="large" color={globalStyles.primaryFontColor.color} />
        <Text>Авторизация...</Text>
      </View>
    </View>
  );
};

export default AuthLoadingModal;
