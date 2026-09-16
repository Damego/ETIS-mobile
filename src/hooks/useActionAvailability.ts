import { useTranslation } from 'react-i18next';
import { ToastAndroid } from 'react-native';

import { useAppSelector } from './redux';

interface ActionUnavailableMessages {
  demo?: string;
  offline?: string;
}

/**
 * Действия, изменяющие данные на сервере (смена пароля/почты, отправка
 * сообщений, заказ справок и т.п.), невозможны в демо- и оффлайн-режимах:
 * запрос либо некуда отправлять, либо сервер не сможет его авторизовать.
 * Хук возвращает `guard`, который показывает пользователю причину отказа
 * и сообщает, можно ли выполнять действие.
 */
const useActionAvailability = () => {
  const { t } = useTranslation();
  const { isDemo, isOfflineMode } = useAppSelector((state) => state.account);

  const guard = ({ demo, offline }: ActionUnavailableMessages = {}): boolean => {
    if (isOfflineMode) {
      ToastAndroid.show(offline ?? t('offline.actionUnavailable'), ToastAndroid.LONG);
      return false;
    }

    if (isDemo) {
      ToastAndroid.show(demo ?? t('settings.unavailableInDemoOrOffline'), ToastAndroid.LONG);
      return false;
    }

    return true;
  };

  return guard;
};

export default useActionAvailability;
