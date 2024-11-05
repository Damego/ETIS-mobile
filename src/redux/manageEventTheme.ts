import { cache } from '~/cache/smartCache';
import { ThemeType } from '~/styles/themes';
import { isHalloween, isNewYear } from '~/utils/events';

import { changeTheme, setEvents } from './reducers/settingsSlice';
import { AppDispatch, AppStore } from './store';

// const manageHalloweenEvent = async (store: AppStore, dispatch: AppDispatch) => {
//   const state = store.getState();
//   const {
//     config: { theme: themeType, events },
//   } = state.settings;
//
//   const $events = { ...events };
//   const $isHalloween = isHalloween();
//
//   if ($isHalloween && !$events.halloween?.suggestedTheme) {
//     $events.halloween = {
//       suggestedTheme: true,
//       previousTheme: themeType,
//     };
//     dispatch(changeTheme(ThemeType.halloween));
//     cache.placeTheme(ThemeType.halloween);
//     dispatch(setEvents($events));
//     cache.placeEvents($events);
//   }
//   if (!$isHalloween && themeType === ThemeType.halloween) {
//     if (!$events.halloween) {
//       dispatch(changeTheme(ThemeType.auto));
//       cache.placeTheme(ThemeType.auto);
//     } else {
//       dispatch(changeTheme($events.halloween.previousTheme));
//       cache.placeTheme($events.halloween.previousTheme);
//
//       // Clean up event data for the next time
//       $events.halloween = undefined;
//       dispatch(setEvents($events));
//       cache.placeEvents($events);
//     }
//   }
// };
//
// const manageNewYearEvent = (store: AppStore, dispatch: AppDispatch) => {
//   const state = store.getState();
//   const {
//     config: { theme: themeType, events },
//   } = state.settings;
//
//   if (!isNewYear() && themeType) {
//     let returnTheme: ThemeType;
//
//     if (!events.newYear2024?.previousTheme || isNewYearTheme(events.newYear2024.previousTheme))
//       returnTheme = ThemeType.auto;
//     else returnTheme = events.newYear2024.previousTheme;
//
//     dispatch(changeTheme(returnTheme));
//     cache.placeTheme(returnTheme);
//   }
// };

const eventChecks = [];

const manageEventTheme = (store: AppStore) => async (dispatch: AppDispatch) => {
  eventChecks.forEach((func) => func(store, dispatch));
};

export default manageEventTheme;
