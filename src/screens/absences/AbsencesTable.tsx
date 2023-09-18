import React, { useEffect, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';
import { useDispatch } from 'react-redux';

import Dropdown from '../../components/Dropdown';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { IAbsence, IGetAbsencesPayload } from '../../models/absences';
import { GetResultType, RequestType } from '../../models/results';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import AbsencesCard from './AbsencesCard';

export const absencesIconName = 'paperclip';

const AbsencesTable = () => {
  const globalStyles = useGlobalStyles();
  const dispatch = useDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<IAbsence>();
  const client = getWrappedClient();

  const loadData = async (session?: number) => {
    setLoading(true);
    const payload: IGetAbsencesPayload = {
      requestType: RequestType.tryFetch,
    };
    if (session) {
      payload.session = session;
    }
    const result = await client.getAbsencesData(payload);

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      if (!data) setLoading(false);
      ToastAndroid.show('Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (isLoading) return <LoadingScreen onRefresh={loadData} />;
  if (!data) return <NoData onRefresh={loadData} />;

  return (
    <Screen onUpdate={loadData}>
      <View
        style={{
          marginTop: '2%',
          marginLeft: 'auto',
          marginRight: 0,
          paddingBottom: '2%',
          zIndex: 1,
        }}
      >
        <Dropdown
          selectedOption={{
            label: data.currentSession.name,
            value: data.currentSession.number,
            current: false,
          }}
          options={data.sessions.map((session) => ({
            label: session.name,
            value: session.number,
            current: session.number === data.currentSession.number,
          }))}
          onSelect={loadData}
        />
      </View>

      {data.absences.length ? (
        <>
          {data.absences.map((absences, index) => (
            <AbsencesCard key={index} disciplineAbsences={absences} />
          ))}
          <Text
            style={globalStyles.textColor}
          >{`Всего пропущено занятий: ${data.overallMissed}`}</Text>
        </>
      ) : (
        <NoData text="Нет пропущенных занятий!" />
      )}
    </Screen>
  );
};

export default AbsencesTable;
