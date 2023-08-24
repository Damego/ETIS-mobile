import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { useDispatch } from 'react-redux';

import { cache } from '../../cache/smartCache';
import BorderLine from '../../components/BorderLine';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useGlobalStyles } from '../../hooks';
import { ICertificate, ICertificateTable } from '../../models/certificate';
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

const getStylesFooter = (textColor: string): string => `
* {
  color: ${textColor};
  font-size:20pt;
  margin-left: 1%;
}`;

const getStylesHeader = (textColor: string): string => `
* {
  font-size:24pt;
  width: 97%;
}`;

const CertificateTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<ICertificateTable>(null);
  const [isOpened, setOpened] = useState(false);
  const client = getWrappedClient();
  const navigation = useNavigation();
  const globalStyles = useGlobalStyles();

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
    newData.certificates[newData.certificates.findIndex((c) => c.id === certificate.id)] =
      certificate;
    cache.certificate.place(newData.certificates);
    setData(newData);
  };

  if (!data) return <LoadingScreen onRefresh={loadData} />;

  return (
    <Screen onUpdate={loadData}>
      {data.announce.header && (
        <Popover
          placement={PopoverPlacement.FLOATING}
          isVisible={isOpened}
          from={
            <TouchableOpacity onPress={() => setOpened(true)}>
              <Text
                style={[
                  { fontWeight: '600', paddingBottom: '3%' },
                  fontSize.medium,
                  globalStyles.primaryFontColor,
                ]}
              >
                Объявление
              </Text>
            </TouchableOpacity>
          }
          popoverStyle={{
            borderRadius: 10,
            padding: '2%',
          }}
          onRequestClose={() => setOpened(false)}
        >
          <AutoHeightWebView
            scalesPageToFit
            overScrollMode={'never'}
            source={{
              html: data.announce.header,
            }}
            customStyle={getStylesHeader(globalStyles.textColor.color)}
          />
        </Popover>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('RequestCertificate')}
        activeOpacity={0.9}
      >
        <View style={[styles.buttonContainer, globalStyles.border, globalStyles.block]}>
          <AntDesign name="plus" size={iconSize} color={globalStyles.textColor.color} />
          <Text style={[fontSize.medium, globalStyles.textColor]}>Заказать справку</Text>
        </View>
      </TouchableOpacity>
      <BorderLine />
      {data.certificates.map((certificate, index) => (
        <Certificate key={index} certificate={certificate} updateData={updateData} />
      ))}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: '80%',
          alignItems: 'center',
        }}
      >
        <AutoHeightWebView
          scalesPageToFit
          overScrollMode={'never'}
          source={{
            html: data.announce.footer,
          }}
          customStyle={getStylesFooter(globalStyles.textColor.color)}
        />
      </View>
    </Screen>
  );
};

export default CertificateTable;
