import QuickActions from 'react-native-quick-actions';

export const addShortcuts = () =>
  QuickActions.setShortcutItems([
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
  ]);
