import { Action, isSupported, setItems } from 'expo-quick-actions';
import { AppState } from 'react-native';

import i18next from '~/i18n';
import logger from '~/utils/logger';

interface AppShortcutItem extends Action {
  id: string;
}

const SHORTCUTS_ITEMS: AppShortcutItem[] = [
  {
    id: 'SignsNavigator',
    title: i18next.t('shortcuts.grades'),
    icon: 'signs',
  },
  {
    id: 'Messages',
    title: i18next.t('shortcuts.messages'),
    icon: 'messages',
  },
  {
    id: 'Announces',
    title: i18next.t('shortcuts.announces'),
    icon: 'announce',
  },
];

export const addShortcuts = async () => {
  // https://sentry.io/issues/ETIS-MOBILE-9X — the native module rejects setItems().
  try {
    if (!(await isSupported())) return;
    await setItems(SHORTCUTS_ITEMS);
  } catch (error) {
    logger.warn('addShortcuts failed', error);
  }
};

// Основной вызов из App.tsx происходит на этапе загрузки JS-бандла, т.е. до
// Activity.onResume. Нативный setShortcuts() строит Intent через
// `currentActivity!!` (expo-quick-actions 6.0.2), поэтому в этот момент он
// падает с NullPointerException. Ждём AppState === 'active' (на Android он
// становится active ровно на onHostResume, уже после установки currentActivity).
export const registerShortcuts = () => {
  if (AppState.currentState === 'active') {
    void addShortcuts();
    return;
  }

  const subscription = AppState.addEventListener('change', (state) => {
    if (state !== 'active') return;
    subscription.remove();
    void addShortcuts();
  });
};
