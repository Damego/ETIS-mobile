import React from 'react';

import { cache } from '~/cache/smartCache';
import Card from '~/components/Card';
import Text from '~/components/Text';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';
import { fontSize } from '~/utils/texts';

const ToggleShowGapsBetweenPairs = () => {
  const { showGapsBetweenPairs, showEmptyPairs } = useAppSelector(
    (state) => state.settings.config.ui
  );
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { showGapsBetweenPairs: !showGapsBetweenPairs };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={[{ fontWeight: '500' }, fontSize.medium]}>Показывать пропуски между парами</Text>

      <ThemedSwitch onValueChange={toggle} value={showGapsBetweenPairs} disabled={showEmptyPairs} />
    </Card>
  );
};

export default ToggleShowGapsBetweenPairs;
