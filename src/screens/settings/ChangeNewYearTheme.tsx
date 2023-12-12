import React from 'react';

import { cache } from '../../cache/smartCache';
import Card from '../../components/Card';
import ClickableText from '../../components/ClickableText';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setEvents } from '../../redux/reducers/settingsSlice';
import { fontSize } from '../../utils/texts';

const ChangeNewYearTheme = () => {
  const dispatch = useAppDispatch();
  const { events } = useAppSelector((state) => state.settings);

  const clearEvent = () => {
    const $events = { ...events };
    $events.newYear2024 = {
      suggestedTheme: false,
      previousTheme: events.newYear2024.previousTheme,
    };
    dispatch(setEvents($events));
    cache.placeEvents($events);
  };

  return (
    <Card>
      <ClickableText
        text={'Сменить новогоднюю тему'}
        onPress={clearEvent}
        textStyle={[fontSize.medium, { fontWeight: '500' }]}
        colorVariant={'block'}
      />
    </Card>
  );
};

export default ChangeNewYearTheme;
