import { AntDesign } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { IDisciplineEducationalComplexThemeLink } from '~/models/disciplineEducationalComplex';
import { RIGHT_ICON_SIZE } from '~/screens/etis/disciplineEducationalComplex/components/common';
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

const Theme = ({ theme }: { theme: IDisciplineEducationalComplexThemeLink }) => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={fontSize.medium}>{theme.name}</Text>
      {theme.hasCheckPoint && <ControlBadge />}

      {!!theme.subthemes.length &&
        theme.subthemes.map(($theme) => (
          <View style={{ flexDirection: 'row', marginLeft: '2%' }} key={$theme.id}>
            <Text>- </Text>
            <Theme theme={$theme} />
          </View>
        ))}
    </View>
  );
};

const ThemesBottomSheet = React.forwardRef<
  BottomSheetModal,
  { themes: IDisciplineEducationalComplexThemeLink[] }
>(({ themes }, ref) => {
  return (
    <BottomSheetModal ref={ref} style={{ padding: '2%' }}>
      <BottomSheetScrollView style={{ flex: 1 }}>
        {themes.map((theme, index) => (
          <React.Fragment key={index}>
            <Theme theme={theme} />
            {index !== themes.length - 1 && <BorderLine />}
          </React.Fragment>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const Themes = ({ themes }: { themes: IDisciplineEducationalComplexThemeLink[] }) => {
  const ref = useRef<BottomSheetModal>();

  return (
    <>
      <ClickableText
        onPress={() => ref.current.present()}
        iconRight={<AntDesign name={'right'} size={RIGHT_ICON_SIZE} />}
        textStyle={[fontSize.big, { fontWeight: 'bold' }]}
        viewStyle={{ justifyContent: 'space-between' }}
      >
        Темы
      </ClickableText>
      <ThemesBottomSheet ref={ref} themes={themes} />
    </>
  );
};

export default Themes;
