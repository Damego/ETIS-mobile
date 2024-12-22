import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { LoginResponseType } from '~/api/etis/auth';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '~/hooks';
import useAuth from '~/hooks/useAuth';
import { setAuthorizing, signInDemo } from '~/redux/reducers/accountSlice';
import { httpClient } from '~/utils';
import isDemoCredentials from '~/utils/demo';

import CustomReCaptcha from './ReCaptcha';
import Text from './Text';

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
    elevation: 5,
    shadowColor: '#000',
  },
});

const AuthLoadingModal = () => {
  const dispatch = useAppDispatch();
  const { userCredentials, isAuthorizing } = useAppSelector((state) => state.account);
  const [showOfflineButton, setShowOfflineButton] = useState<boolean>(false);
  const [messageStatus, setMessageStatus] = useState<string>();
  const [isInvisibleRecaptcha, setIsInvisibleRecaptcha] = useState<boolean>(true);
  const [isLoading, setLoading] = useState(false);
  const globalStyles = useGlobalStyles();

  const auth = useAuth();

  const onReceiveToken = async (token: string) => {
    // console.log('TOKEN', token);
    // const res = await axios.post(
    //   `https://www.google.com/recaptcha/api/siteverify?secret=${
    //     isInvisibleRecaptcha
    //       ? '6LcXEKIqAAAAAH_iSx6AiFtbwHYDo8QEdVRR7dFh'
    //       : '6LcaEKIqAAAAAM3GIu5BqSQ0GOB2b07ofUYiBkrU'
    //   }&response=${token}`,
    //   {},
    //   {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    //     },
    //   }
    // );
    // console.log('ReCaptcha RESPONSE:', res.data);
    setLoading(true);
    setMessageStatus('Авторизация...');

    if (isDemoCredentials(userCredentials)) {
      dispatch(signInDemo(true));
      dispatch(setAuthorizing(false));
      return;
    }

    const code = await auth.login(token, isInvisibleRecaptcha);

    if (code === LoginResponseType.missingToken || code === LoginResponseType.invalidToken) {
      setMessageStatus(`Получение токена...`);
      setIsInvisibleRecaptcha(false);
      return;
    }

    dispatch(setAuthorizing(false));
    setLoading(false);
  };

  const onRecaptchaModalClose = () => {
    if (!isInvisibleRecaptcha && !isLoading) dispatch(setAuthorizing(false));
  };

  useEffect(() => {
    setMessageStatus('Получение токена...');

    // Вход в оффлайн режим слишком резкий, поэтому ставим таймер 1 сек.
    // TODO: В идеале, сразу после Splash включать оффлайн режим

    setTimeout(() => {
      httpClient.isInternetReachable().then((res) => {
        if (!res) auth.signInOffline();
      });
    }, 1000);

    // Если интернет есть, но он очень медленный
    setTimeout(() => {
      if (!isAuthorizing) return;
      setShowOfflineButton(true);
    }, 6000);
  }, []);

  return (
    <View style={styles.modalWrapper}>
      <CustomReCaptcha
        onReceiveToken={onReceiveToken}
        size={isInvisibleRecaptcha ? 'invisible' : 'normal'}
        onClose={onRecaptchaModalClose}
      />
      <View style={[styles.modalContainer, globalStyles.container]}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={globalStyles.primaryText.color} />
          <Text style={globalStyles.textColor}>{messageStatus}</Text>

          {showOfflineButton && (
            <View style={{ marginTop: '15%' }}>
              <Button
                title="Оффлайн режим"
                // onPress={auth.signInOffline}
                color={globalStyles.primaryText.color}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default AuthLoadingModal;
