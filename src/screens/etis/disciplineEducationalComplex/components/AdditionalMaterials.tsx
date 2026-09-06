import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import FileTextLink from '~/components/FileTextLink';
import Text from '~/components/Text';
import { IAdditionalMaterials } from '~/models/disciplineEducationalComplex';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const AdditionalMaterialsBottomSheet = React.forwardRef<
  BottomSheetModal,
  { readonly data: IAdditionalMaterials }
>(({ data }, ref) => {
  const { t } = useTranslation();
  return (
    <BottomSheetModal ref={ref} snapPoints={['50%', '100%']}>
      <BottomSheetContent title={t('dec.additionalMaterials')}>
        <Text style={[fontSize.big, { fontWeight: 'bold' }]}>{t('dec.files')}</Text>
        {data.files.map((file, index) => (
          <FileTextLink key={index} src={file.uri} fileName={file.name} style={fontSize.medium}>
            {file.name}
          </FileTextLink>
        ))}
      </BottomSheetContent>
    </BottomSheetModal>
  );
});

const AdditionalMaterials = ({ data }: { readonly data: IAdditionalMaterials }) => {
  const { t } = useTranslation();
  const ref = useRef<BottomSheetModal | null>(null);

  return (
    <>
      <SectionRow label={t('dec.additionalMaterials')} onPress={() => ref.current?.present()} />
      <AdditionalMaterialsBottomSheet ref={ref} data={data} />
    </>
  );
};

export default AdditionalMaterials;
