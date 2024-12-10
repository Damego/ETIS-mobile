import { BottomSheetScrollView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { View } from 'react-native';
import Text from '~/components/Text';
import { ControlBadge } from '~/components/education/disciplineEducationalComplex/ControlBadge';
import RightIcon from '~/components/education/disciplineEducationalComplex/RightIcon';
import useAppRouter from '~/hooks/useAppRouter';
import { IDisciplineEducationalComplexThemeLink } from '~/models/disciplineEducationalComplex';
import { fontSize } from '~/utils/texts';

import BorderLine from '../../BorderLine';
import BottomSheetModal from '../../BottomSheetModal';
import ClickableText from '../../ClickableText';

const Theme = ({
  theme,
  disciplineName,
}: {
  theme: IDisciplineEducationalComplexThemeLink;
  disciplineName: string;
}) => {
  const router = useAppRouter();
  const bottomSheetModal = useBottomSheetModal();

  return (
    <View style={{ flex: 1, paddingVertical: '2%' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <ClickableText
          textStyle={fontSize.medium}
          onPress={() => {
            router.push('disciplineEducationalComplexTheme', {
              payload: { theme, disciplineName },
            });
            bottomSheetModal.dismiss();
          }}
        >
          {theme.name}
        </ClickableText>
        {theme.hasCheckPoint && <ControlBadge />}
      </View>

      {!!theme.subthemes.length &&
        theme.subthemes.map(($theme, index) => (
          <React.Fragment key={$theme.id}>
            <View style={{ flexDirection: 'row', marginLeft: '4%', alignItems: 'center' }}>
              <Theme theme={$theme} disciplineName={disciplineName} />
            </View>
            {index !== theme.subthemes.length - 1 && <BorderLine />}
          </React.Fragment>
        ))}
    </View>
  );
};

const ThemesBottomSheet = React.forwardRef<
  BottomSheetModal,
  { themes: IDisciplineEducationalComplexThemeLink[]; disciplineName: string }
>(({ themes, disciplineName }, ref) => {
  return (
    <BottomSheetModal ref={ref} style={{ padding: '2%' }}>
      <Text style={[fontSize.slarge, { fontWeight: 'bold', textAlign: 'center' }]}>Темы</Text>
      <BottomSheetScrollView style={{ flex: 1 }}>
        {themes.map((theme, index) => (
          <React.Fragment key={index}>
            <Theme theme={theme} disciplineName={disciplineName} />
            {index !== themes.length - 1 && <BorderLine />}
          </React.Fragment>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const Themes = ({
  themes,
  disciplineName,
}: {
  themes: IDisciplineEducationalComplexThemeLink[];
  disciplineName: string;
}) => {
  const ref = useRef<BottomSheetModal>();

  return (
    <>
      <ClickableText
        onPress={() => ref.current.present()}
        iconRight={<RightIcon />}
        textStyle={[fontSize.big, { fontWeight: 'bold' }]}
        viewStyle={{ justifyContent: 'space-between' }}
      >
        Темы
      </ClickableText>
      <ThemesBottomSheet ref={ref} themes={themes} disciplineName={disciplineName} />
    </>
  );
};

export default Themes;
