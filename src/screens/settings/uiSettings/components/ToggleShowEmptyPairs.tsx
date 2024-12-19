import React from 'react';
import { Switch } from 'react-native';
import { cache } from '~/cache/smartCache';
import Card from '~/components/Card';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setUIConfig } from '~/redux/reducers/settingsSlice';
import { fontSize } from '~/utils/texts';

const ToggleShowEmptyPairs = () => {
  const theme = useAppTheme();
  const { showEmptyPairs } = useAppSelector((state) => state.settings.config.ui);
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { showEmptyPairs: !showEmptyPairs };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={[{ fontWeight: '500' }, fontSize.medium]}>Показывать пустые пары</Text>

      <Switch
        trackColor={{ false: 'gray', true: theme.colors.primary }}
        thumbColor="white"
        onValueChange={toggle}
        value={showEmptyPairs}
      />
    </Card>
  );
};

export default ToggleShowEmptyPairs;
