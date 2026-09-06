import { Action, isSupported, setItems } from 'expo-quick-actions';

import i18next from '~/i18n';
import logger from '~/utils/logger';

export interface AppShortcutItem extends Action {
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
  // https://sentry.io/issues/ETIS-MOBILE-9X — on some devices the native
  // module rejects setItems(); setItems must never crash the app on startup.
  try {
    if (!(await isSupported())) return;
    await setItems(SHORTCUTS_ITEMS);
  } catch (error) {
    logger.warn('addShortcuts failed', error);
  }
};
