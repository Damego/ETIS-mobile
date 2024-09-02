import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { cache } from '~/cache/smartCache';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '~/hooks';
import { TimetableModes, setUIConfig } from '~/redux/reducers/settingsSlice';
import { fontSize } from '~/utils/texts';

const formatTimetableMode = (mode: TimetableModes) =>
  ({
    [TimetableModes.weeks]: 'По неделям',
    [TimetableModes.days]: 'По дням',
  })[mode];

const ChangeTimetableModeButton = () => {
  const globalStyles = useGlobalStyles();
  const dispatch = useAppDispatch();
  const { timetableMode } = useAppSelector((state) => state.settings.config.ui);
  const modalRef = useRef<BottomSheetModal>();

  const handlePress = () => modalRef.current.present();

  const handleModeSelect = (mode: TimetableModes) => () => {
    dispatch(setUIConfig({ timetableMode: mode }));
    cache.setUIConfig({ timetableMode: mode });
  };

  return (
    <>
      <ClickableText
        onPress={handlePress}
        iconRight={
          <Text style={[{ fontWeight: '500' }, fontSize.medium]}>
            {formatTimetableMode(timetableMode)}
          </Text>
        }
        viewStyle={[
          globalStyles.card,
          { paddingHorizontal: '2%', paddingVertical: '3%', justifyContent: 'space-between' },
        ]}
        textStyle={[{ fontWeight: '500' }, fontSize.medium]}
      >
        Отображение расписания
      </ClickableText>
      <BottomSheetModal ref={modalRef}>
        <BottomSheetView style={{ alignItems: 'center', gap: 16 }}>
          {Object.values(TimetableModes)
            .filter((mode) => typeof mode === 'number')
            .map((mode: TimetableModes) => (
              <ClickableText
                onPress={handleModeSelect(mode)}
                textStyle={[{ fontWeight: '500' }, fontSize.big]}
                colorVariant={mode === timetableMode && 'primary'}
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
