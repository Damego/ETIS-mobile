import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { getAudienceTimetable } from '~/api/psutech/api';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import useRoutePayload from '~/hooks/useRoutePayload';
import useTimetable from '~/hooks/useTimetable';
import { IAudience } from '~/models/timeTable';
import { fontSize } from '~/utils/texts';

const AudienceTimetable = () => {
  const { audience } = useRoutePayload<{ audience: IAudience }>();

  const timetable = useTimetable({ onRequestUpdate: (week) => setFetchWeek(week) });
  const [fetchWeek, setFetchWeek] = React.useState<number>(timetable.selectedWeek);

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => getAudienceTimetable(audience.id, fetchWeek),
    queryKey: ['aud-timetable', fetchWeek, audience.id],
  });

  useEffect(() => {
    if (data) {
      timetable.updateData(data.weekInfo);
    }
  }, [data]);

  return (
    <Screen onUpdate={refetch}>
      {data && (
        <Text style={[fontSize.large, { fontWeight: 'bold', alignSelf: 'center' }]}>
          Аудитория: {data.audience.string}
        </Text>
      )}

      <TimetableContainer
        timetable={timetable}
        data={data}
        isLoading={isLoading}
        loadingComponent={() => <LoadingContainer />}
      />
    </Screen>
  );
};

export default AudienceTimetable;
