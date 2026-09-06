import { cache } from '~/cache/smartCache';
import { LanguagePreference } from '~/i18n';
import { ThemeType } from '~/styles/themes';
import { Events } from '~/utils/events';

import { changeTheme, setEvents, setLanguage } from './reducers/settingsSlice';
import { AppDispatch } from './store';

// Запись настроек всегда идёт парой: dispatch в стейт + сохранение
// в хранилище. Хелперы держат пару в одной точке, чтобы изменение
// схемы хранения не приходилось править в каждом потребителе.
export const persistTheme = (dispatch: AppDispatch, theme: ThemeType) => {
  dispatch(changeTheme(theme));
  cache.placeTheme(theme);
};

export const persistEvents = (dispatch: AppDispatch, events: Events) => {
  dispatch(setEvents(events));
  cache.placeEvents(events);
};

export const persistLanguage = (dispatch: AppDispatch, language: LanguagePreference) => {
  dispatch(setLanguage(language));
  cache.placeLanguage(language);
};
