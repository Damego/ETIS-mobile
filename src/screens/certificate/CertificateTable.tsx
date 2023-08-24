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
import { useAppTheme } from '../../hooks/theme';
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
  font-size:24pt;
  margin-left: 1%;
}`;

const CertificateTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<ICertificateTable>(null);
  const client = getWrappedClient();
  const navigation = useNavigation();
  const globalStyles = useGlobalStyles();
  const appTheme = useAppTheme();

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
        <View
          style={[
            {
              paddingVertical: '2%',
              paddingHorizontal: '2%',
              marginBottom: '2%',
            },
            globalStyles.block,
            globalStyles.border,
          ]}
        >
          <Popover
            placement={PopoverPlacement.FLOATING}
            from={(_, showPopover) => (
              <TouchableOpacity
                onPress={showPopover}
                style={{
                  paddingVertical: '2%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                activeOpacity={0.45}
              >
                <Text
                  style={[{ fontWeight: '600' }, fontSize.medium, globalStyles.primaryFontColor]}
                >
                  Объявление
                </Text>
              </TouchableOpacity>
            )}
            popoverStyle={{
              borderRadius: 10,
              padding: '2%',
              backgroundColor: appTheme.colors.background,
            }}
          >
            <Text
              textBreakStrategy={'simple'}
              selectable
              style={[fontSize.medium, globalStyles.textColor]}
            >
              {data.announce.header}
            </Text>
          </Popover>
        </View>
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
          top: '75%',
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
