import { BottomSheetView } from '@expo/ui/community/bottom-sheet';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { cache } from '~/cache/smartCache';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import SettingRow from '~/components/SettingRow';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig, TimetableModes } from '~/redux/reducers/settingsSlice';
import { fontSize } from '~/utils/texts';

const ChangeTimetableModeButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { timetableMode } = useAppSelector((state) => state.settings.config.ui);
  const modalRef = useRef<BottomSheetModal | null>(null);

  const formatTimetableMode = (mode: TimetableModes) =>
    ({
      [TimetableModes.weeks]: t('settings.timetableModeWeeks'),
      [TimetableModes.days]: t('settings.timetableModeDays'),
    })[mode];

  const handlePress = () => modalRef.current?.present();

  const handleModeSelect = (mode: TimetableModes) => () => {
    dispatch(setUIConfig({ timetableMode: mode }));
    cache.setUIConfig({ timetableMode: mode });
  };

  return (
    <>
      <SettingRow
        label={t('settings.timetableMode')}
        onPress={handlePress}
        right={<Text style={[{ fontWeight: '500' }, fontSize.medium]}>{formatTimetableMode(timetableMode)}</Text>}
      />
      <BottomSheetModal ref={modalRef}>
        <BottomSheetView style={{ alignItems: 'center', gap: 16 }}>
          {Object.values(TimetableModes)
            .filter((mode) => typeof mode === 'number')
            .map((mode: TimetableModes) => (
              <ClickableText
                onPress={handleModeSelect(mode)}
                textStyle={[{ fontWeight: '500' }, fontSize.big]}
                colorVariant={mode === timetableMode ? 'primary' : undefined}
                key={mode}
              >
                {formatTimetableMode(mode)}
              </ClickableText>
            ))}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default ChangeTimetableModeButton;
