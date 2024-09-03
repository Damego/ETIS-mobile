import { AntDesign } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { View } from 'react-native';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import useSignsQuery from '~/hooks/useSignsQuery';
import GradesContainer from '~/screens/etis/main/grades/GradesContainer';
import PeriodsBottomSheet from '~/screens/etis/main/grades/PeriodsBottomSheet';
import { fontSize } from '~/utils/texts';

const Grades = () => {
  const { data, isLoading, refresh, loadSession } = useSignsQuery();
  const ref = useRef<BottomSheetModal>();
  const theme = useAppTheme();

  let component: React.ReactNode;

  if (isLoading) {
    component = <LoadingContainer />;
  } else if (!data) {
    component = <NoData onRefresh={refresh} />;
  } else {
    component = <GradesContainer data={data} />;
  }

  const handlePeriodPress = (period: number) => {
    loadSession(period);
  };

  return (
    <Screen onUpdate={refresh}>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: '2%' }}>
        <Text style={{ fontWeight: '700', fontSize: 22, flex: 2 }}>Оценки</Text>
        {data && (
          <ClickableText
            onPress={() => ref.current.present()}
            textStyle={fontSize.big}
            iconRight={<AntDesign name="swap" size={18} color={theme.colors.text} />}
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
