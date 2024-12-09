import { AntDesign } from '@expo/vector-icons';
import React, { useRef } from 'react';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import OptionsBottomSheet from '~/components/bottomSheets/OptionsBottomSheet';
import AbsencesCard from '~/components/education/absences/AbsencesCard';
import { useClient } from '~/data/client';
import { useAppTheme } from '~/hooks/theme';
import useQuery from '~/hooks/useQuery';
import { RequestType } from '~/models/results';
import { fontSize } from '~/utils/texts';

const Absences = () => {
  const theme = useAppTheme();
  const client = useClient();
  const { data, isLoading, refresh, update } = useQuery({
    method: client.getAbsencesData,
  });
  const modalRef = useRef<BottomSheetModal>();

  const loadSession = (session: number) => {
    update({ data: session, requestType: RequestType.tryFetch });
  };

  let component: React.ReactNode;

  if (isLoading) component = <LoadingContainer />;
  else if (!data || !data.absences.length)
    component = (
      <NoData
        text={data ? 'Нет пропущенных занятий!' : undefined}
        onRefresh={!data ? refresh : undefined}
      />
    );
  else
    component = (
      <>
        {data.absences.map((absences, index) => (
          <AbsencesCard key={index} disciplineAbsences={absences} />
        ))}
        <Text>{`Всего пропущено занятий: ${data.overallMissed}`}</Text>
      </>
    );

  return (
    <Screen onUpdate={refresh}>
      {data && (
        <ClickableText
          onPress={() => modalRef.current.present()}
          textStyle={fontSize.big}
          iconRight={<AntDesign name="swap" size={18} color={theme.colors.text} />}
          viewStyle={{ gap: 4, alignSelf: 'flex-end' }}
        >
          {data.currentSession.name}
        </ClickableText>
      )}
      {component}

      {data && (
        <OptionsBottomSheet
          ref={modalRef}
          options={data.sessions.map((session) => ({
            label: session.name,
            value: session.number.toString(),
            isCurrent: session.number === data.currentSession.number,
          }))}
          onOptionPress={(value) => loadSession(Number(value))}
        />
      )}
    </Screen>
  );
};

export default Absences;
