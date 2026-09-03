import React from 'react';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { changeTheme, setEvents } from '~/redux/reducers/settingsSlice';
import { isEventTheme, ThemeType } from '~/styles/themes';
import { fontSize } from '~/utils/texts';

/**
 * Отключение событийной темы (хэллоуин/новый год) с возвратом
 * темы, которая стояла до включения события.
 * Показывается только когда событийная тема активна.
 */
const ChangeEventTheme = () => {
  const dispatch = useAppDispatch();
  const { theme, events } = useAppSelector((state) => state.settings.config);

  if (!isEventTheme(theme)) return;

  const disableEventTheme = () => {
    const eventData = theme === 'halloween' ? events.halloween : events.newYear;
    const returnTheme: ThemeType =
      eventData?.previousTheme && !isEventTheme(eventData.previousTheme)
        ? eventData.previousTheme
        : ThemeType.auto;

    dispatch(changeTheme(returnTheme));
    cache.placeTheme(returnTheme);

    // Отмечаем, что тему уже предлагали — до конца события повторно включаться не будет
    const $events = {
      ...events,
      [theme]: { suggestedTheme: true, previousTheme: returnTheme },
    };
    dispatch(setEvents($events));
    cache.placeEvents($events);
  };

  return (
    <SettingRow
      label='Отключить праздничную тему'
      onPress={disableEventTheme}
      right={
        <Text style={[{ fontWeight: '500' }, fontSize.medium]}>
          {theme === 'halloween' ? 'Хэллоуин' : 'Новый год'}
        </Text>
      }
    />
  );
};

export default ChangeEventTheme;
