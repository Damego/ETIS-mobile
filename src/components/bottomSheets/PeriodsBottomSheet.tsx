import React from 'react';
import { StyleSheet } from 'react-native';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';

interface Props {
  readonly currentPeriod: number;
  readonly latestPeriod: number;
  readonly periodName: string;
  readonly onChange: (value: number) => void;
}

const getOptions = ({
  currentPeriod,
  latestPeriod,
  periodName,
}: {
  currentPeriod: number;
  latestPeriod: number;
  periodName: string;
}) => {
  const arr = Array.from(new Array(latestPeriod)).map((_, ind) => ind + 1);
  return arr
    .map((number) => ({
      label: `${number} ${periodName}`,
      value: number,
      isCurrent: number === currentPeriod,
    }))
    .reverse();
};

/**
 * Выбор семестра/периода в шторке.
 *
 * Обязательно с snapPoints (см. комментарий в OptionsBottomSheet):
 * без них @expo/ui на Android меряет контент циклически — узкая ширина
 * и преждевременные переносы, а длинный список семестров не скроллится
 * и уходит за нижний край экрана.
 */
const PeriodsBottomSheet = React.forwardRef<BottomSheetModal, Props>(
  ({ currentPeriod, latestPeriod, periodName, onChange }, ref) => {
    const options = getOptions({
      currentPeriod,
      latestPeriod,
      periodName,
    });
    return (
      <BottomSheetModal ref={ref} snapPoints={['50%', '100%']}>
        <BottomSheetContent>
          {options?.map((item) => (
            <ClickableText
              key={item.value}
              viewStyle={styles.option}
              textStyle={styles.optionText}
              colorVariant={item.isCurrent ? 'primary' : 'text'}
              onPress={() => onChange(item.value)}
            >
              {item.label}
            </ClickableText>
          ))}
        </BottomSheetContent>
      </BottomSheetModal>
    );
  }
);

export default PeriodsBottomSheet;

const styles = StyleSheet.create({
  option: {
    paddingVertical: 12,
    width: '100%',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
