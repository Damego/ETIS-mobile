import { cache } from '../cache/smartCache';
import { ThemeType, isNewYearTheme } from '../styles/themes';
import { isHalloween, isNewYear } from '../utils/events';
import { changeTheme, setEvents } from './reducers/settingsSlice';
import { AppDispatch, AppStore } from './store';

const manageHalloweenEvent = async (store: AppStore, dispatch: AppDispatch) => {
  const state = store.getState();
  const {
    config: { theme: themeType, events },
  } = state.settings;

  const $events = { ...events };
  const $isHalloween = isHalloween();

  if ($isHalloween && !$events.halloween2023?.suggestedTheme) {
    $events.halloween2023 = {
      suggestedTheme: true,
      previousTheme: themeType,
    };
    dispatch(changeTheme(ThemeType.halloween));
    cache.placeTheme(ThemeType.halloween);
    dispatch(setEvents($events));
    cache.placeEvents($events);
  }
  if (!$isHalloween && themeType === ThemeType.halloween) {
    if (!$events.halloween2023) {
      dispatch(changeTheme(ThemeType.auto));
      cache.placeTheme(ThemeType.auto);
    } else {
      dispatch(changeTheme($events.halloween2023.previousTheme));
      cache.placeTheme($events.halloween2023.previousTheme);
    }
  }
};

const manageNewYearEvent = (store: AppStore, dispatch: AppDispatch) => {
  const state = store.getState();
  const {
    config: { theme: themeType, events },
  } = state.settings;

  if (!isNewYear() && isNewYearTheme(themeType)) {
    let returnTheme: ThemeType;

    if (!events.newYear2024?.previousTheme || isNewYearTheme(events.newYear2024.previousTheme))
      returnTheme = ThemeType.auto;
    else returnTheme = events.newYear2024.previousTheme;

    dispatch(changeTheme(returnTheme));
    cache.placeTheme(returnTheme);
  }
};

const eventChecks = [manageHalloweenEvent, manageNewYearEvent];

const manageEventTheme = (store: AppStore) => async (dispatch: AppDispatch) => {
  eventChecks.forEach((func) => func(store, dispatch));
};

export default manageEventTheme;
