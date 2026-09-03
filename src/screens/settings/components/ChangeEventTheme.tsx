import React from 'react';

import SettingRow from '~/components/SettingRow';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { persistEvents, persistTheme } from '~/redux/persistSettings';
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
    const eventData = theme === ThemeType.halloween ? events.halloween : events.newYear;
    const returnTheme: ThemeType =
      eventData?.previousTheme && !isEventTheme(eventData.previousTheme)
        ? eventData.previousTheme
        : ThemeType.auto;

    persistTheme(dispatch, returnTheme);

    // Отмечаем, что тему уже предлагали — до конца события повторно включаться не будет
    persistEvents(dispatch, {
      ...events,
      [theme]: { suggestedTheme: true, previousTheme: returnTheme },
    });
  };

  return (
    <SettingRow
      label='Отключить праздничную тему'
      onPress={disableEventTheme}
      right={
        <Text style={[{ fontWeight: '500' }, fontSize.medium]}>
          {theme === ThemeType.halloween ? 'Хэллоуин' : 'Новый год'}
        </Text>
      }
    />
  );
};

export default ChangeEventTheme;
