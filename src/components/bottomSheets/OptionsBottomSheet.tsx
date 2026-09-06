import React from 'react';
import { StyleSheet } from 'react-native';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';

interface IOption {
  label: string;
  value: string;
  isCurrent: boolean;
}

interface Props {
  readonly options: IOption[];
  readonly onOptionPress: (value: string) => void;
  readonly currentOptionValue?: string;
}

/**
 * Меню выбора опций в шторке.
 *
 * Без snapPoints (fitToContents): высота шторки — ровно по контенту,
 * никаких фиксированных 50% экрана. Подводные камни режима (цикл
 * измерения ширины, отсутствие скролла) закрыты в BottomSheetContent
 * через проп fitContent.
 */
const OptionsBottomSheet = React.forwardRef<BottomSheetModal, Props>(
  ({ options, currentOptionValue, onOptionPress }, ref) => (
    <BottomSheetModal ref={ref}>
      <BottomSheetContent fitContent>
        {options?.map((item) => (
          <ClickableText
            key={item.value}
            viewStyle={styles.option}
            textStyle={styles.optionText}
            colorVariant={item.isCurrent || item.value === currentOptionValue ? 'primary' : 'text'}
            onPress={() => onOptionPress(item.value)}
          >
            {item.label}
          </ClickableText>
        ))}
      </BottomSheetContent>
    </BottomSheetModal>
  )
);

export default OptionsBottomSheet;

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
