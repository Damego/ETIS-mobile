import { Action, isSupported, setItems } from 'expo-quick-actions';

export interface AppShortcutItem extends Action {
  id: string;
}

const SHORTCUTS_ITEMS: AppShortcutItem[] = [
  {
    id: 'SignsNavigator',
    title: 'Оценки',
    icon: 'signs',
  },
  {
    id: 'Messages',
    title: 'Сообщения',
    icon: 'messages',
  },
  {
    id: 'Announces',
    title: 'Объявления',
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
    console.warn('addShortcuts failed', error);
  }
};
