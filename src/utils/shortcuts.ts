import { Action, setItems } from 'expo-quick-actions';

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

export const addShortcuts = () => setItems(SHORTCUTS_ITEMS);
