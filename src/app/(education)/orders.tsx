import React from 'react';
import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import Order from '~/screens/etis/orders/Order';

const OrderTable = () => {
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getOrdersData,
  });

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh} containerStyle={{ gap: 8 }}>
      {data.map((order, index) => (
        <Order key={index} order={order} />
      ))}
    </Screen>
  );
};

export default OrderTable;
