import { BottomSheetModal } from '@expo/ui/community/bottom-sheet';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import BorderLine from '~/components/BorderLine';
import PeriodsBottomSheet from '~/components/bottomSheets/PeriodsBottomSheet';
import CardHeaderOut from '~/components/CardHeaderOut';
import ClickableText from '~/components/ClickableText';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import useRatingQuery from '~/hooks/useRatingQuery';
import { IRatingGroup } from '~/models/rating';
import { fontSize } from '~/utils/texts';

import RightText from './RightText';

const Group = ({ group }: { readonly group: IRatingGroup }) => {
  const { t } = useTranslation();
  if (!group.overall) {
    return (
      <CardHeaderOut topText={group.name}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[{ fontWeight: 'bold' }, fontSize.medium]}>
            {t('rating.noData')}
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
                {t('rating.position', { top: discipline.top, total: discipline.total })}
              </Text>
              {index !== group.disciplines.length - 1 && <BorderLine />}
            </View>
          ))}
        </View>

        <RightText
          topText={group.overall.top}
          bottomText={t('rating.outOf', { total: group.overall.total })}
        />
      </View>
    </CardHeaderOut>
  );
};

export default function Rating() {
  const { data, isLoading, refresh, loadSession } = useRatingQuery();

  const theme = useAppTheme();
  const modalRef = useRef<BottomSheetModal | null>(null);

  let component: React.ReactNode;
  if (isLoading) component = <LoadingContainer />;
  else if (!data) component = <NoData onRefresh={refresh} />;
  else component = data.groups.map((group) => <Group key={group.name} group={group} />);

  return (
    <Screen onUpdate={refresh}>
      {data ? <ClickableText
        textStyle={fontSize.big}
        iconRight={<AntDesign name='swap' size={18} color={theme.colors.text} />}
        viewStyle={{ gap: 4, alignSelf: 'flex-end' }}
        onPress={() => modalRef.current?.present()}
      >
        {data.session.current} {data.session.name}
      </ClickableText> : null}

      {component}

      {data ? <PeriodsBottomSheet
        ref={modalRef}
        currentPeriod={data.session.current}
        latestPeriod={data.session.latest}
        periodName={data.session.name}
        onChange={loadSession}
      /> : null}
    </Screen>
  );
}
