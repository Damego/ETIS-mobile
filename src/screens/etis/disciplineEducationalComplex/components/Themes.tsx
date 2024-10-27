import { BottomSheetScrollView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { IDisciplineEducationalComplexThemeLink } from '~/models/disciplineEducationalComplex';
import { EducationNavigationProp } from '~/navigation/types';
import RightIcon from '~/screens/etis/disciplineEducationalComplex/RightIcon';
import { fontSize } from '~/utils/texts';

const ControlBadge = () => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[controlBadgeStyles.view, globalStyles.primaryBackgroundColor]}>
      <Text style={[controlBadgeStyles.text, globalStyles.primaryContrastText]}>Контроль</Text>
    </View>
  );
};

const controlBadgeStyles = StyleSheet.create({
  view: {
    borderRadius: 5,
    paddingHorizontal: '1%',
    paddingVertical: '0.5%',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

const Theme = ({
  theme,
  disciplineName,
}: {
  theme: IDisciplineEducationalComplexThemeLink;
  disciplineName: string;
}) => {
  const navigation = useNavigation<EducationNavigationProp>();
  const bottomSheetModal = useBottomSheetModal();

  return (
    <View style={{ flex: 1, paddingVertical: '2%' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
