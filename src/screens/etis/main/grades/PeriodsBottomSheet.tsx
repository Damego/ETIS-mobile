import { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import { ISessionPoints } from '~/models/sessionPoints';

interface Props {
  data: ISessionPoints;
  onChange: (value: number) => void;
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

const PeriodsBottomSheet = React.forwardRef<BottomSheetModal, Props>(({ data, onChange }, ref) => {
  const options = getOptions({
    currentPeriod: data.currentSession,
    latestPeriod: data.latestSession,
    periodName: data.sessionName,
  });
  return (
    <BottomSheetModal ref={ref}>
      <BottomSheetView>
        {options?.map((item) => (
          <ClickableText
            key={item.value}
            onPress={() => onChange(item.value)}
            viewStyle={{ padding: '2%', width: '100%', justifyContent: 'center' }}
            textStyle={{ fontSize: 18, fontWeight: '600' }}
            colorVariant={item.isCurrent ? 'primary' : 'text'}
          >
            {item.label}
          </ClickableText>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default PeriodsBottomSheet;
