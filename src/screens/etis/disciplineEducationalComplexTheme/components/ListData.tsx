import React, { useRef } from 'react';
import { Linking } from 'react-native';

import BorderLine from '~/components/BorderLine';
import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { IListItem } from '~/models/disciplineEducationalComplexTheme';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const ListContainerBottomSheet = React.forwardRef<
  BottomSheetModal,
  { label: string; data: IListItem[] }
>(({ label, data }, ref) => (
  <BottomSheetModal ref={ref} snapPoints={['50%', '100%']}>
    <BottomSheetContent title={label}>
      {data.map(($data, index) => (
        <React.Fragment key={index}>
          <ClickableText
            onPress={() => Linking.openURL($data.url ?? '#')}
            disabled={!$data.url}
            textStyle={fontSize.medium}
            textProps={{ selectable: true }}
            viewStyle={{ paddingVertical: 4 }}
          >
            {$data.title}
          </ClickableText>
          {index !== data.length - 1 && <BorderLine />}
        </React.Fragment>
      ))}
    </BottomSheetContent>
  </BottomSheetModal>
));

const ListData = ({ label, data }: { label: string; data: IListItem[] }) => {
  const ref = useRef<BottomSheetModal | null>(null);

  return (
    <>
      <SectionRow label={label} onPress={() => ref.current?.present()} />
      <ListContainerBottomSheet ref={ref} label={label} data={data} />
    </>
  );
};

export default ListData;
