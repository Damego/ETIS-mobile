import { AntDesign } from '@expo/vector-icons';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import LoadingScreen, { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import useSignsQuery from '~/hooks/useSignsQuery';
import Shortcuts from '~/screens/etis/main/components/Shortcuts';
import GradesContainer from '~/screens/etis/main/grades/GradesContainer';
import PeriodsBottomSheet from '~/screens/etis/main/grades/PeriodsBottomSheet';

const Grades = ({ onShortcutPress }) => {
  const { data, isLoading, refresh, loadSession } = useSignsQuery();
  const ref = useRef<BottomSheetModal>();
  const theme = useAppTheme();

  let component: React.ReactNode;

  if (isLoading) {
    component = <LoadingContainer />;
  }
  if (!data) {
    component = <NoData onRefresh={refresh} />;
  } else {
    component = <GradesContainer data={data} />;
  }

  const handlePeriodPress = (period: number) => {
    loadSession(period);
  };

  return (
    <Screen>
      <Shortcuts current={'grades'} onPress={onShortcutPress} />

      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: '2%' }}>
        <Text style={{ fontWeight: '700', fontSize: 22, flex: 2 }}>Оценки</Text>
        {data && (
          <ClickableText
            onPress={() => ref.current.present()}
            textStyle={{ fontSize: 18 }}
            iconRight={<AntDesign name="swap" size={18} color={theme.colors.text2} />}
            viewStyle={{ gap: 4 }}
          >
            {data.currentSession} {data.sessionName}
          </ClickableText>
        )}
      </View>

      {component}

      {data && <PeriodsBottomSheet ref={ref} data={data} onChange={handlePeriodPress} />}
    </Screen>
  );
};

export default Grades;
