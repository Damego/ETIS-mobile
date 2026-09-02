import { useBottomSheet } from '@expo/ui/community/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { View } from 'react-native';

import BorderLine from '~/components/BorderLine';
import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { IDisciplineEducationalComplexThemeLink } from '~/models/disciplineEducationalComplex';
import { EducationNavigationProp } from '~/navigation/types';
import { ControlBadge } from '~/screens/etis/disciplineEducationalComplex/components/ControlBadge';
import SectionRow from '~/screens/etis/disciplineEducationalComplex/components/SectionRow';
import { fontSize } from '~/utils/texts';

const Theme = ({
  theme,
  disciplineName,
  depth = 0,
}: {
  theme: IDisciplineEducationalComplexThemeLink;
  disciplineName: string;
  depth?: number;
}) => {
  const navigation = useNavigation<EducationNavigationProp>();
  const bottomSheetModal = useBottomSheet();

  return (
    <View style={{ paddingLeft: depth * 12 }}>
      <View style={{
        flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8
      }}>
        <ClickableText
          textStyle={fontSize.medium}
          onPress={() => {
            navigation.navigate('DisciplineEducationalComplexTheme', {
              theme,
              disciplineName,
            });
            bottomSheetModal.dismiss();
          }}
        >
          {theme.name}
        </ClickableText>
        {theme.hasCheckPoint && <ControlBadge />}
      </View>

      {Boolean(theme.subthemes.length) &&
      	theme.subthemes.map(($theme, index) => (
      	  <React.Fragment key={$theme.id}>
      	    <View style={{ marginTop: 4 }}>
      	      <Theme theme={$theme} disciplineName={disciplineName} depth={depth + 1} />
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
>(({ themes, disciplineName }, ref) => (
  <BottomSheetModal ref={ref}>
    <BottomSheetContent title='Темы'>
      {themes.map((theme, index) => (
        <React.Fragment key={index}>
          <Theme theme={theme} disciplineName={disciplineName} />
          {index !== themes.length - 1 && <BorderLine />}
        </React.Fragment>
      ))}
    </BottomSheetContent>
  </BottomSheetModal>
));

const Themes = ({
  themes,
  disciplineName,
}: {
  themes: IDisciplineEducationalComplexThemeLink[];
  disciplineName: string;
}) => {
  const ref = useRef<BottomSheetModal | undefined>(undefined);

  return (
    <>
      <SectionRow label='Темы' onPress={() => ref.current.present()} />
      <ThemesBottomSheet ref={ref} themes={themes} disciplineName={disciplineName} />
    </>
  );
};

export default Themes;
