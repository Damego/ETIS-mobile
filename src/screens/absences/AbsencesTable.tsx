import React, { useEffect, useState } from 'react';
import { ToastAndroid, Text, View, StyleProp, TextStyle, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { GetResultType, RequestType } from '../../models/results';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { IGetAbsencesPayload, IPeriodAbsences } from '../../models/absences';
import AbsencesCard from './AbsencesCard';
import styles from './AbsencesStyles';
import { AntDesign } from '@expo/vector-icons';
import { fontSize } from '../../utils/texts';
import ClickableText from '../../components/ClickableText';

export const absencesIconName = 'paperclip';

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
    [globalStyles.textColor, empty() ? [fontSize.medium, { marginTop: 10 }] : {}];

  return (
    <Screen onUpdate={loadData}>
      <View style={[styles.hbox, styles.flexWrap, styles.centre, { columnGap: 20, marginBottom: 20 }]}>
        {data.periods.map((value: string, index: number) => (
          <ClickableText key={index} 
            onPress={() => {if (index + 1 !== data.period) loadData(index + 1)}}
            viewStyle={{ padding: 0 }}
            textStyle={[
              {paddingVertical: 5},
              fontSize.medium, 
              globalStyles.textColor,
              index + 1 === data.period ? {} : {textDecorationLine: 'underline'}
            ]}
            text={value} />
        ))}
      </View>
      
      {data.absences.map((absences, index) => (
        <AbsencesCard key={index} disciplineAbsences={absences} />
      ))}
      <View style={ empty() ? styles.rootView : {} }>
        {empty() ?
          <AntDesign name={absencesIconName} size={doubledIconSize} color={globalStyles.textColor.color} /> 
        : <></>}
        <Text style={textStyles}>
          { 'Всего пропущено занятий: ' + data.overallMissed }
        </Text>
      </View>
    </Screen>
  );
};

export default AbsencesTable;