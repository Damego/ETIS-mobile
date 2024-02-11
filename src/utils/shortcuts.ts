import { Action, setItems } from 'expo-quick-actions';

import { BottomTabsParamList } from '../navigation/types';

export interface AppShortcutItem extends Action {
  id: keyof BottomTabsParamList;
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
