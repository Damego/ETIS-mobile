import React, { useEffect, useState } from 'react';
import { ToastAndroid, Text, View, StyleProp, TextStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { GetResultType, IGetPayload, RequestType } from '../../models/results';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { IGetAbsencesPayload, IPeriodAbsences } from '../../models/absences';
import AbsencesCard from './AbsencesCard';
import styles from './AbsencesStyles';
import { AntDesign } from '@expo/vector-icons';
import { fontSize } from '../../utils/texts';

const AbsencesTable = () => {
  const globalStyles = useGlobalStyles();
  const dispatch = useDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<IPeriodAbsences>(null);
  const client = getWrappedClient();
  const doubledIconSize = 72;

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
    // let test: IPeriodAbsences = { period: 1, overallMissed: 9, absences: [] };

    // test.absences.push( 
    //   { dates: ["21.09", "22.09", "23.09", "01.10", "02.10"], subject: 'Элементы высшей математики', type: "практика", teacher: "Andrey Vasiliev" },
    //   { dates: ["18.09", "22.09"], subject: 'Иностранный язык', type: "практика", teacher: "Andrey Vasiliev" },
    //   { dates: ["12.09", "14.09"], subject: 'Биология', type: "практика", teacher: "Andrey Vasiliev" }
    // );
    // setData(test);

    
    setLoading(false);
  };  

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (isLoading) return <LoadingScreen onRefresh={loadData} />;
  if (!data) return <NoData onRefresh={loadData} />;

  const empty = (): boolean => {
    return data.absences.length === 0;
  };

  let textStyles: StyleProp<TextStyle> = 
    [globalStyles.textColor, empty() ? { fontSize: fontSize.medium.fontSize, marginTop: 10 } : {}];

  return (
    <Screen onUpdate={loadData}>
      {data.absences.map((absences, index) => (
        <AbsencesCard disciplineAbsences={absences} key={index} />
      ))}
      <View style={ empty() ? styles.rootView : {} }>
        {empty() ?
        <AntDesign name={'paperclip'} size={doubledIconSize} color={globalStyles.textColor.color} /> 
        : <></>}
        <Text style={textStyles}>
          { 'Всего пропущено занятий: ' + data.overallMissed }
        </Text>
      </View>
    </Screen>
  );
};

export default AbsencesTable;