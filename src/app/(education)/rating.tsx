import { AntDesign } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import CardHeaderOut from '~/components/CardHeaderOut';
import ClickableText from '~/components/ClickableText';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import PeriodsBottomSheet from '~/components/bottomSheets/PeriodsBottomSheet';
import RightText from '~/components/education/rating/RightText';
import { useAppTheme } from '~/hooks/theme';
import useRatingQuery from '~/hooks/useRatingQuery';
import { IGroup } from '~/models/rating';
import { fontSize } from '~/utils/texts';

const Group = ({ group }: { group: IGroup }) => {
  if (!group.overall) {
    return (
      <CardHeaderOut topText={group.name}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[{ fontWeight: 'bold' }, fontSize.medium]}>
            Нет рейтинга для отображения
          </Text>
        </View>
      </CardHeaderOut>
    );
  }
  return (
    <CardHeaderOut topText={group.name}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ width: '70%' }}>
          {group.disciplines.map((discipline, index) => (
            <View key={discipline.discipline}>
              <Text style={fontSize.medium}>{discipline.discipline}</Text>
              <Text style={fontSize.medium}>
                {discipline.top} из {discipline.total}
              </Text>
              {index !== group.disciplines.length - 1 && <BorderLine />}
            </View>
          ))}
        </View>

        <RightText topText={group.overall.top} bottomText={`из ${group.overall.total}`} />
      </View>
    </CardHeaderOut>
  );
};

export default function Rating() {
  const { data, isLoading, refresh, loadSession } = useRatingQuery();

  const theme = useAppTheme();
  const modalRef = useRef<BottomSheetModal>();

  let component: React.ReactNode;
  if (isLoading) component = <LoadingContainer />;
  else if (!data) component = <NoData onRefresh={refresh} />;
  else component = data.groups.map((group) => <Group group={group} key={group.name} />);

  return (
    <Screen onUpdate={refresh}>
      {data && (
        <ClickableText
          onPress={() => modalRef.current.present()}
          textStyle={fontSize.big}
          iconRight={<AntDesign name="swap" size={18} color={theme.colors.text} />}
          viewStyle={{ gap: 4, alignSelf: 'flex-end' }}
        >
          {data.session.current} {data.session.name}
        </ClickableText>
      )}

      {component}

      {data && (
        <PeriodsBottomSheet
          ref={modalRef}
          currentPeriod={data.session.current}
          latestPeriod={data.session.latest}
          periodName={data.session.name}
          onChange={loadSession}
        />
      )}
    </Screen>
  );
}
