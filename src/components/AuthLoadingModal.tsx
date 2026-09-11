import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator, Button, StyleSheet, ToastAndroid, View
} from 'react-native';

import { cache } from '~/cache/smartCache';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '~/hooks';
import i18next from '~/i18n';
import {
  setAuthorizing,
  signIn,
  signInDemo,
  signOut,
  UserCredentials,
} from '~/redux/reducers/accountSlice';
import { httpClient } from '~/utils';
import isDemoCredentials from '~/utils/demo';
import logger from '~/utils/logger';

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

enum LoginResponseType {
  success,
  failed,
  privacyPolicyNotAccepted,
  invalidUserCredentials,
  rateLimited,
}

const makeLogin = async (
  userCredentials: UserCredentials,
  saveUserCredentials: boolean
): Promise<LoginResponseType> => {
  if (!(await cache.hasAcceptedPrivacyPolicy())) return LoginResponseType.privacyPolicyNotAccepted;

  const response = await httpClient.login(
    userCredentials.login,
    userCredentials.password
  );

  if (response && response.error) {
    // У нас нет других вариантов проверять тип ошибки
    const message: string = response.error.message.toLowerCase();

    if (message.includes('лимит')) {
      ToastAndroid.show(
        i18next.t('auth.attemptLimitExceeded'),
        ToastAndroid.SHORT
      );
      return LoginResponseType.rateLimited;
    }

    ToastAndroid.show(response.error.message, ToastAndroid.SHORT);

    if (message.includes('неверное')) return LoginResponseType.invalidUserCredentials;

    return LoginResponseType.failed;
  }

  if (saveUserCredentials) {
    await cache.placeUserCredentials(userCredentials);
  }
  return LoginResponseType.success;
};

const AuthLoadingModal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { userCredentials, saveUserCredentials, fromStorage, isAuthorizing } = useAppSelector(
    (state) => state.account
  );
  const [showOfflineButton, setShowOfflineButton] = useState<boolean>(false);
  const [messageStatus, setMessageStatus] = useState<string>();
  const [isLoading, setLoading] = useState(false);
  const globalStyles = useGlobalStyles();

  const authorize = async () => {
    // Модал показывается только при авторизации, когда креды уже введены/загружены
    if (!userCredentials) return;
    setLoading(true);
    setMessageStatus(t('auth.authorizing'));

    if (isDemoCredentials(userCredentials)) {
      dispatch(signInDemo(true));
      dispatch(setAuthorizing(false));
      return;
    }

    const response = await makeLogin(userCredentials, saveUserCredentials);

    if (response === LoginResponseType.rateLimited) {
      dispatch(signOut({}));
    } else if (response === LoginResponseType.invalidUserCredentials) {
      // Данные устарели, поэтому их стоит удалить
      dispatch(signOut({ cleanUserCredentials: true }));
    } else if (response === LoginResponseType.success) {
      dispatch(signIn({}));
    } else if (response === LoginResponseType.failed) {
      // fromStorage Для проверки, были ли загружены данные из хранилища или нет (т.е. пользователь ввёл данные в форме)
      // Возможно, что пользователь вышел из аккаунта или неудачная попытка ввода данных,
      // то нам не нужно заходить в оффлайн режим в этих случаях
      // Если же етис недоступен, но данные идут из хранилища, то разрешаем оффлайн режим

      // Есть небольшая уязвимость, если пользователь сменит пароль, то приложение всё равно войдёт в оффлайн режим
      // при недоступности етиса или интернета
      signInOffline();
    }

    dispatch(setAuthorizing(false));
    setLoading(false);
  };

  useEffect(() => {
    authorize();

    // Вход в оффлайн режим слишком резкий, поэтому ставим таймер 1 сек.
    // TODO: В идеале, сразу после Splash включать оффлайн режим

    setTimeout(() => {
      httpClient.isInternetReachable().then((res) => {
        if (!res) signInOffline();
      });
    }, 1000);

    // Если интернет есть, но он очень медленный
    setTimeout(() => {
      if (!isAuthorizing) return;
      setShowOfflineButton(true);
    }, 6000);
  }, []);

  const signInOffline = () => {
    if (fromStorage) {
      logger.log('[AUTH] Signed in as offline');
      dispatch(signIn({ isOffline: true }));
      dispatch(setAuthorizing(false));
    }
  };

  return (
    <View style={styles.modalWrapper}>
      <View style={[styles.modalContainer, globalStyles.container]}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' color={globalStyles.primaryText.color} />
          <Text style={globalStyles.textColor}>{messageStatus}</Text>

          {showOfflineButton ? <View style={{ marginTop: '15%' }}>
            <Button
              title={t('offline.mode')}
              color={globalStyles.primaryText.color}
              onPress={signInOffline}
            />
          </View> : null}
        </View>
      </View>
    </View>
  );
};

export default AuthLoadingModal;
