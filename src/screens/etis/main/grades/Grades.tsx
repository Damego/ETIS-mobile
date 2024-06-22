import { AntDesign } from '@expo/vector-icons';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import BottomSheetModal from '~/components/BottomSheetModal';
import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import useSignsQuery from '~/hooks/useSignsQuery';
import { ICheckPoint } from '~/models/sessionPoints';
import Shortcuts, { Shortcut } from '~/screens/etis/main/components/Shortcuts';
import { fontSize } from '~/utils/texts';

import CardSign from './CardSign';

const getOptions = ({
  currentPeriod,
  latestPeriod,
  periodName,
}: {
  currentPeriod: number;
  latestPeriod: number;
  periodName: string;
}) => {
  const arr = Array.from(new Array(latestPeriod)).map((_, ind) => ind + 1);
  return arr
    .map((number) => ({
      label: `${number} ${periodName}`,
      value: number,
      isCurrent: number === currentPeriod,
    }))
    .reverse();
};

const Grades = ({ onShortcutPress }) => {
  const { data, isLoading, refresh, loadSession } = useSignsQuery();
  const theme = useAppTheme();
  const ref = useRef<BottomSheetModal>();

  const options = useMemo(
    () =>
      data
        ? getOptions({
            currentPeriod: data.currentSession,
            latestPeriod: data.latestSession,
            periodName: data.sessionName,
          })
        : null,
    [data]
  );

  if (isLoading && !data) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

  const handlePeriodPress = (period: number) => {
    loadSession(period);
  };

  return (
    <Screen>
      <Shortcuts current={'grades'} onPress={onShortcutPress} />

      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: '2%' }}>
        <Text style={{ fontWeight: '700', fontSize: 22, flex: 2 }}>Оценки</Text>
        <ClickableText
          onPress={() => ref.current.present()}
          textStyle={{ fontSize: 18 }}
          iconRight={<AntDesign name="swap" size={18} color={theme.colors.text2} />}
          viewStyle={{ gap: 4 }}
        >
          {data.currentSession} {data.sessionName}
        </ClickableText>
      </View>

      {data.subjects.map((subject, index) => (
        <View key={subject.name}>
          <CardSign subject={subject} />
          {index !== data.subjects.length - 1 && <BorderLine />}
        </View>
      ))}

      <BottomSheetModal ref={ref} onDismiss={() => ref.current.dismiss()}>
        <BottomSheetView>
          {options?.map((item) => (
            <ClickableText
              key={item.value}
              onPress={() => handlePeriodPress(item.value)}
              viewStyle={{ padding: '2%', width: '100%', justifyContent: 'center' }}
              textStyle={{ fontSize: 18, fontWeight: '600' }}
              colorVariant={item.isCurrent ? 'primary' : 'text2'}
            >
              {item.label}
            </ClickableText>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </Screen>
  );
};

export default Grades;
