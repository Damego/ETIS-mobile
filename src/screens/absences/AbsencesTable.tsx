import React, { useEffect, useState } from 'react';
import { ToastAndroid, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { GetResultType, IGetPayload, RequestType } from '../../models/results';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { IGetAbsencesPayload, IPeriodAbsences } from '../../models/absences';
import AbsencesRow, { styles } from './AbsencesRow';
import AbsencesHeader from './AbsencesHeader';

const AbsencesTable = () => {
  const globalStyles = useGlobalStyles();
  const dispatch = useDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<IPeriodAbsences>(null);
  const client = getWrappedClient();

  const loadData = async (period?: number) => {
    setLoading(true);
    const payload: IGetAbsencesPayload = {
      requestType: RequestType.tryFetch,
    };
    if (typeof(period) !== 'undefined') {
      payload.period = period;
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
    let test: IPeriodAbsences = { period: 1, overallMissed: 10, absences: [] };
    test.overallMissed = 10;
    test.period = 1;
    test.absences.push( { number: 5, time: "21.09", subject: 'Math', type: "practice", teacher: "Andrey Vasiliev" },
    { number: 2, time: "22.09", subject: 'Math', type: "practice", teacher: "Andrey Vasiliev" } );
    setData(test);

    
    if (data != null) {
      data.absences.push({ number: 5, time: "21.09", subject: 'Math', type: "practice", teacher: "Andrey Vasiliev" },
                         { number: 2, time: "22.09", subject: 'Math', type: "practice", teacher: "Andrey Vasiliev" });
    }
    setLoading(false);
  };  

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (isLoading) return <LoadingScreen onRefresh={loadData} />;
  if (!data) return <NoData onRefresh={loadData} />;

  return (
    <Screen onUpdate={loadData}>
      <DataTable style={styles.table} >
        {data.absences.length !== 0 ? <AbsencesHeader /> : <></> }
        {data.absences.map((absences, index) => (
           <AbsencesRow record={absences} key={index} ></AbsencesRow>
        ))}
        <Text style={globalStyles.textColor && styles.centre}>{ 'Всего пропущено занятий: ' + data.overallMissed }</Text>
      </DataTable>
    </Screen>
  );
};

export default AbsencesTable;