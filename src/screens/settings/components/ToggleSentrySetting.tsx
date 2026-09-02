import { AntDesign, Fontisto } from '@expo/vector-icons';
import React from 'react';
import {
  Linking, ToastAndroid, TouchableOpacity
} from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import Text from '~/components/Text';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setSentryEnabled } from '~/redux/reducers/settingsSlice';
import { SENTRY_PULL_REQUEST } from '~/utils/consts';
import { fontSize } from '~/utils/texts';

const AboutSentryPopover = () => {
  const globalStyles = useGlobalStyles();
  const appTheme = useAppTheme();

  return (
    <Popover
      placement={PopoverPlacement.FLOATING}
      from={(_, toggleShow) => (
        <TouchableOpacity onPress={toggleShow}>
          <AntDesign name={'infocirlceo'} size={24} color={appTheme.colors.text} />
        </TouchableOpacity>
      )}
      popoverStyle={{
        borderRadius: globalStyles.border.borderRadius,
        padding: '2%',
        backgroundColor: appTheme.colors.container,
      }}
    >
      <Text textBreakStrategy={'simple'} selectable style={fontSize.medium}>
        Эта настройка позволяет отправлять ошибки, возникшие в ходе работы приложения, в сервис
        Sentry.
      </Text>
      <Text
        onPress={() => Linking.openURL(SENTRY_PULL_REQUEST)}
        style={[fontSize.medium, { textDecorationLine: 'underline' }]}
        colorVariant={'primary'}
      >
        Подробнее
      </Text>
    </Popover>
  );
};

const ToggleSentrySetting = () => {
  const dispatch = useAppDispatch();
  const { sentryEnabled } = useAppSelector((state) => state.settings.config);
  const theme = useAppTheme();

  const toggleSentryEnabled = (value: boolean) => {
    dispatch(setSentryEnabled(value));
    cache.setSentryEnabled(value);

    ToastAndroid.show('Перезапустите приложение', ToastAndroid.LONG);
  };

  return (
    <SettingRow
      label='Отправлять ошибки'
      icon={<Fontisto name={'sentry'} size={24} color={theme.colors.text} />}
      hint={<AboutSentryPopover />}
      right={<ThemedSwitch onValueChange={toggleSentryEnabled} value={sentryEnabled} />}
    />
  );
};

export default ToggleSentrySetting;
