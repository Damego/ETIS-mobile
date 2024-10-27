import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { Linking } from 'react-native';
import BorderLine from '~/components/BorderLine';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { IListItem } from '~/models/disciplineEducationalComplexTheme';
import RightIcon from '~/screens/etis/disciplineEducationalComplex/RightIcon';
import { fontSize } from '~/utils/texts';

const ListContainerBottomSheet = React.forwardRef<
  BottomSheetModal,
  { label: string; data: IListItem[] }
>(({ label, data }, ref) => {
  return (
    <BottomSheetModal
      ref={ref}
      style={{ paddingHorizontal: '2%' }}
      snapPoints={['50%']}
      enableDynamicSizing={false}
    >
      <Text style={[fontSize.slarge, { fontWeight: 'bold', textAlign: 'center' }]}>{label}</Text>

      <BottomSheetScrollView>
        {data.map(($data, index) => (
          <React.Fragment key={index}>
            <ClickableText
              onPress={() => Linking.openURL($data.url)}
              disabled={!$data.url}
              textProps={{ selectable: true }}
            >
              {$data.title}
            </ClickableText>
            {index !== data.length - 1 && <BorderLine />}
          </React.Fragment>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const ListData = ({ label, data }: { label: string; data: IListItem[] }) => {
  const ref = useRef<BottomSheetModal>();

  return (
    <>
      <ClickableText
        onPress={() => ref.current.present()}
        iconRight={<RightIcon />}
        textStyle={[fontSize.big, { fontWeight: 'bold' }]}
        viewStyle={{ justifyContent: 'space-between' }}
      >
        {label}
      </ClickableText>
      <ListContainerBottomSheet ref={ref} label={label} data={data} />
    </>
  );
};

export default ListData;
