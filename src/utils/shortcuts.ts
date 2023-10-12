import QuickActions, { ShortcutItem } from 'react-native-quick-actions';

import { BottomTabsParamList } from '../navigation/types';

export interface AppShortcutItem extends ShortcutItem {
  type: keyof BottomTabsParamList;
}

const SHORTCUTS_ITEMS: AppShortcutItem[] = [
  {
    type: 'SignsNavigator',
    title: 'Оценки',
    icon: 'signs',
    userInfo: { url: '' },
  },
  {
    type: 'Messages',
    title: 'Сообщения',
    icon: 'messages',
    userInfo: { url: '' },
  },
  {
    type: 'Announces',
    title: 'Объявления',
    icon: 'announce',
    userInfo: { url: '' },
  },
];

export const addShortcuts = () => {
  try {
    return QuickActions.setShortcutItems(SHORTCUTS_ITEMS);
  } catch (e) {
    // I hate js. Damego
  }
};
