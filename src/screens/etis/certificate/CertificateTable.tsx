import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import BorderLine from '~/components/BorderLine';
import Card from '~/components/Card';
import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import useQuery from '~/hooks/useQuery';
import { ServicesNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

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
          backgroundColor: appTheme.colors.block,
        }}
      >
        <Text
          textBreakStrategy={'simple'}
          selectable
          style={fontSize.medium}
          colorVariant={'block'}
        >
          {info}
        </Text>
      </Popover>
    </Card>
  );
};

const RequestCertificateButton = () => {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<ServicesNavigationProp>();

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
          color={globalStyles.fontColorForBlock.color}
          style={{ marginRight: '2%' }}
        />
        <Text style={[{ fontWeight: '500' }, fontSize.medium, globalStyles.fontColorForBlock]}>
          Заказать справку
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

const CertificateTable = () => {
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getCertificateData,
  });
  const globalStyles = useGlobalStyles();

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData />;

  return (
    <Screen onUpdate={refresh}>
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
              globalStyles.primaryText,
            ]}
            cardStyle={{ marginBottom: '0%' }}
          />

          <BorderLine />
        </>
      )}

      {data.announce.footer && (
        <>
          <RequestCertificateButton />
          <ButtonWithPopover
            title="Сроки и выдача справок"
            info={data.announce.footer}
            textStyle={[
              {
                fontWeight: '500',
              },
              fontSize.medium,
              globalStyles.fontColorForBlock,
            ]}
            icon={
              <AntDesign
                name="infocirlceo"
                size={iconSize}
                color={globalStyles.fontColorForBlock.color}
                style={{ marginRight: '2%' }}
              />
            }
            cardStyle={{ marginBottom: '0%' }}
          />
          <BorderLine />
        </>
      )}

      {data.certificates?.map((certificate, index) => (
        <Certificate key={index} certificate={certificate} />
      ))}
    </Screen>
  );
};

export default CertificateTable;
