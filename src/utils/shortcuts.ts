import QuickActions, { ShortcutItem } from 'react-native-quick-actions';

const SHORTCUTS_ITEMS: ShortcutItem[] = [
  {
    type: 'Timetable',
    title: 'Расписание',
    icon: 'timetable',
    userInfo: { url: '' },
  },
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
]

export const addShortcuts = () => {
  try {
    return QuickActions.setShortcutItems(SHORTCUTS_ITEMS)
  } catch (e) {
    // I hate js. Damego
  }
}