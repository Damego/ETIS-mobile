import { cache } from '~/cache/smartCache';
import { ThemeType } from '~/styles/themes';
import {
  EventData, Events, isHalloween, isNewYear
} from '~/utils/events';

import { changeTheme, setEvents } from './reducers/settingsSlice';
import { AppDispatch, AppStore } from './store';

interface EventCheck {
  // Тип события (совпадает с полем в Events)
  event: keyof Events;
  // Активно ли событие прямо сейчас
  isActive: () => boolean;
  // Тема события
  theme: ThemeType;
}

/**
 * Автоматическое включение событийных тем в праздничные даты
 * и возврат прежней темы после окончания события.
 *
 * Для каждого события:
 * - событие активно + тема ещё не предлагалась → включаем событийную тему,
 *   прежняя сохраняется в events.<event>.previousTheme;
 * - событие активно + событийная тема уже стоит → previousTheme обновляется,
 *   чтобы после окончания вернуться к текущему выбору пользователя;
 * - событие закончилось + стоит событийная тема → возвращаем previousTheme
 *   (или auto, если он сам событийный/не сохранился) и очищаем данные события.
 *
 * Вызывается после загрузки стейта из хранилища (см. App.tsx).
 */

const persistTheme = (dispatch: AppDispatch, theme: ThemeType) => {
  dispatch(changeTheme(theme));
  cache.placeTheme(theme);
};

const persistEvents = (dispatch: AppDispatch, events: Events) => {
  dispatch(setEvents(events));
  cache.placeEvents(events);
};

const eventChecks: EventCheck[] = [
  {
    event: 'halloween',
    isActive: isHalloween,
    theme: ThemeType.halloween,
  },
  {
    event: 'newYear',
    isActive: isNewYear,
    theme: ThemeType.newYear,
  },
];

const manageEventTheme = (store: AppStore) => async (dispatch: AppDispatch) => {
  const state = store.getState();
  const {
    config: { theme: currentTheme, events },
  } = state.settings;

  for (const { event, isActive, theme } of eventChecks) {
    const eventData = events[event];

    if (isActive()) {
      if (currentTheme === theme) {
        // Событийная тема активна (включена авто или вручную) — обновляем
        // previousTheme, чтобы после события вернуться к выбору пользователя
        if (eventData && eventData.previousTheme !== theme) {
          const updated: EventData = { suggestedTheme: true, previousTheme: currentTheme };
          persistEvents(dispatch, { ...events, [event]: updated });
        }
        continue;
      }

      // Уже предлагали — не навязываем повторно
      if (eventData?.suggestedTheme) continue;

      persistTheme(dispatch, theme);
      persistEvents(dispatch, {
        ...events,
        [event]: { suggestedTheme: true, previousTheme: currentTheme },
      });
      return;
    }

    // Событие закончилось, а тема ещё активна — возвращаем прежнюю
    if (currentTheme === theme) {
      const returnTheme =
        eventData?.previousTheme && eventData.previousTheme !== theme
          ? eventData.previousTheme
          : ThemeType.auto;

      persistTheme(dispatch, returnTheme);
      persistEvents(dispatch, { ...events, [event]: undefined });
    }
  }
};

export default manageEventTheme;
