import { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';

export interface IOption {
  label: string;
  value: string;
  isCurrent: boolean;
}

interface Props {
  options: IOption[];
  onOptionPress: (value: string) => void;
  currentOptionValue?: string;
}

const OptionsBottomSheet = React.forwardRef<BottomSheetModal, Props>(
  ({ options, currentOptionValue, onOptionPress }, ref) => {
    return (
      <BottomSheetModal ref={ref}>
        <BottomSheetView>
          {options?.map((item) => (
            <ClickableText
              key={item.value}
              onPress={() => onOptionPress(item.value)}
              viewStyle={{ padding: '2%', width: '100%', justifyContent: 'center' }}
              textStyle={{ fontSize: 18, fontWeight: '600' }}
              colorVariant={
                item.isCurrent || item.value === currentOptionValue ? 'primary' : 'text'
              }
            >
              {item.label}
            </ClickableText>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default OptionsBottomSheet;
