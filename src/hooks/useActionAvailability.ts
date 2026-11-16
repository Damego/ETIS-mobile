import { useTranslation } from 'react-i18next';

import { showToast } from '~/utils';

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
      showToast(offline ?? t('offline.actionUnavailable'), 'long');
      return false;
    }

    if (isDemo) {
      showToast(demo ?? t('settings.unavailableInDemoOrOffline'), 'long');
      return false;
    }

    return true;
  };

  return guard;
};

export default useActionAvailability;
