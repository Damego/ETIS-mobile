import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  ToastAndroid,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { useDispatch } from 'react-redux';

import { cache } from '../../cache/smartCache';
import BorderLine from '../../components/BorderLine';
import Card from '../../components/Card';
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

const iconSize = 24;

const ButtonWithPopover = ({
  title,
  info,
  textStyle,
  cardStyle,
  icon,
}: {
  title: string;
  info: string;
  textStyle?: StyleProp<TextStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}) => {
  const globalStyles = useGlobalStyles();
  const appTheme = useAppTheme();

  return (
    <Card style={cardStyle}>
      <Popover
        placement={PopoverPlacement.FLOATING}
        from={(_, showPopover) => (
          <TouchableOpacity
            onPress={showPopover}
            style={[
              {
                paddingVertical: '2%',
                flexDirection: 'row',
              },
            ]}
            activeOpacity={0.45}
          >
            {icon}
            <Text style={textStyle}>{title}</Text>
          </TouchableOpacity>
        )}
        popoverStyle={{
          borderRadius: globalStyles.border.borderRadius,
          padding: '2%',
          backgroundColor: appTheme.colors.background,
        }}
      >
        <Text
          textBreakStrategy={'simple'}
          selectable
          style={[fontSize.medium, globalStyles.textColor]}
        >
          {info}
        </Text>
      </Popover>
    </Card>
  );
};

const RequestCertificateButton = () => {
  const navigation = useNavigation();
  const globalStyles = useGlobalStyles();

  return (
    <Card>
      <TouchableOpacity
        onPress={() => navigation.navigate('RequestCertificate')}
        activeOpacity={0.9}
        style={{ flexDirection: 'row', paddingVertical: '2%' }}
      >
        <AntDesign
          name="plus"
          size={iconSize}
          color={globalStyles.textColor.color}
          style={{ marginRight: '2%' }}
        />
        <Text style={[{ fontWeight: '500' }, fontSize.medium, globalStyles.textColor]}>
          Заказать справку
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

const CertificateTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<ICertificateTable>(null);
  const client = getWrappedClient();

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
        <>
          <ButtonWithPopover
            title="Объявление"
            info={data.announce.header}
            textStyle={[
              {
                fontWeight: '600',
              },
              fontSize.large,
              globalStyles.primaryFontColor,
            ]}
          />

          <BorderLine />
        </>
      )}

      <RequestCertificateButton />
      <ButtonWithPopover
        title="Сроки и выдача справок"
        info={data.announce.footer}
        textStyle={[
          {
            fontWeight: '500',
          },
          fontSize.medium,
          globalStyles.textColor,
        ]}
        icon={
          <AntDesign
            name="infocirlceo"
            size={iconSize}
            color={globalStyles.textColor.color}
            style={{ marginRight: '2%' }}
          />
        }
      />
      <BorderLine />

      {data.certificates.map((certificate, index) => (
        <Certificate key={index} certificate={certificate} updateData={updateData} />
      ))}
    </Screen>
  );
};

export default CertificateTable;
