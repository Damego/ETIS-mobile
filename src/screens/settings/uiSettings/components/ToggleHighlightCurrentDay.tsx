import React from 'react';

import { cache } from '~/cache/smartCache';
import Card from '~/components/Card';
import Text from '~/components/Text';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';
import { fontSize } from '~/utils/texts';

const ToggleHighlightCurrentDay = () => {
  const { highlightCurrentDay } = useAppSelector((state) => state.settings.config.ui);
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { highlightCurrentDay: !highlightCurrentDay };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={[{ fontWeight: '500' }, fontSize.medium]}>Выделять текущий день недели</Text>

      <ThemedSwitch onValueChange={toggle} value={highlightCurrentDay} />
    </Card>
  );
};

export default ToggleHighlightCurrentDay;
