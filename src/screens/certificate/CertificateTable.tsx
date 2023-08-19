import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { cache } from '../../cache/smartCache';
import BorderLine from '../../components/BorderLine';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useGlobalStyles } from '../../hooks';
import { ICertificate } from '../../models/ICertificate';
import { GetResultType, RequestType } from '../../models/results';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { fontSize } from '../../utils/texts';
import Certificate from './Certificate';

const iconSize = 36;
const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

function Button({
  icon,
  text,
  changePage,
}: {
  icon: React.ReactNode;
  text: string;
  changePage: () => void;
}) {
  const globalStyles = useGlobalStyles();

  return (
    <TouchableOpacity onPress={changePage} activeOpacity={0.9}>
      <View style={[styles.buttonContainer, globalStyles.border, globalStyles.block]}>
        {icon}
        <Text style={[fontSize.medium, globalStyles.textColor]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const CertificateTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<ICertificate[]>(null);
  const client = getWrappedClient();
  const iconColor = useGlobalStyles().textColor.color;
  const navigation = useNavigation();

  const loadData = async () => {
    const result = await client.getCertificateData({ requestType: RequestType.tryFetch });

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateData = (certificate: ICertificate) => {
    const newData = data;
    newData[newData.findIndex((c) => c.id === certificate.id)] = certificate;
    cache.certificate.place(newData);
    setData(newData);
  };

  if (!data) return <LoadingScreen onRefresh={loadData} />;

  return (
    <Screen onUpdate={loadData}>
      <Button
        text="Заказать справку"
        icon={<AntDesign name="plus" size={iconSize} color={iconColor} />}
        changePage={() => navigation.navigate('RequestCertificate')}
      />
      <BorderLine />
      {data.map((certificate, index) => (
        <Certificate key={index} certificate={certificate} updateData={updateData} />
      ))}
      <BorderLine />
    </Screen>
  );
};

export default CertificateTable;
