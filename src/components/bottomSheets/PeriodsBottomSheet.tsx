import { BottomSheetView } from '@expo/ui/community/bottom-sheet';
import React from 'react';

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

const PeriodsBottomSheet = React.forwardRef<BottomSheetModal, Props>(
  ({ currentPeriod, latestPeriod, periodName, onChange }, ref) => {
    const options = getOptions({
      currentPeriod,
      latestPeriod,
      periodName,
    });
    return (
      <BottomSheetModal ref={ref}>
        <BottomSheetView>
          {options?.map((item) => (
            <ClickableText
              key={item.value}
              viewStyle={{ padding: '2%', width: '100%', justifyContent: 'center' }}
              textStyle={{ fontSize: 18, fontWeight: '600' }}
              colorVariant={item.isCurrent ? 'primary' : 'text'}
              onPress={() => onChange(item.value)}
            >
              {item.label}
            </ClickableText>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default PeriodsBottomSheet;
