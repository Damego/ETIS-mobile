import { AntDesign } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { View } from 'react-native';

import BottomSheetModal from '~/components/BottomSheetModal';
import PeriodsBottomSheet from '~/components/bottomSheets/PeriodsBottomSheet';
import ClickableText from '~/components/ClickableText';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import useSignsQuery from '~/hooks/useSignsQuery';
import GradesContainer from '~/screens/etis/main/grades/GradesContainer';
import { fontSize } from '~/utils/texts';

const Grades = () => {
  const { data, isLoading, refresh, loadSession } = useSignsQuery();
  const ref = useRef<BottomSheetModal | null>(null);
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
    <Screen onUpdate={refresh} containerStyle={{ gap: 8 }}>
      <View style={{
        flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: '2%'
      }}>
        <Text style={[{ fontWeight: '700', flex: 2 }, fontSize.slarge]}>Оценки</Text>
        {data && (
          <ClickableText
            onPress={() => ref.current?.present()}
            textStyle={fontSize.big}
            iconRight={<AntDesign name='swap' size={18} color={theme.colors.text} />}
            viewStyle={{ gap: 4 }}
          >
            {data.currentSession} {data.sessionName}
          </ClickableText>
        )}
      </View>

      {component}

      {data && (
        <PeriodsBottomSheet
          ref={ref}
          currentPeriod={data.currentSession ?? 1}
          latestPeriod={data.latestSession ?? 1}
          periodName={data.sessionName ?? ''}
          onChange={handlePeriodPress}
        />
      )}
    </Screen>
  );
};

export default Grades;
