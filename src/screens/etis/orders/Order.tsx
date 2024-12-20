import React, { useState } from 'react';
import { StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import CardHeaderIn from '~/components/CardHeaderIn';
import Text from '~/components/Text';
import { getOrderHTML } from '~/data/orders';
import { IOrder } from '~/models/order';
import { fontSize } from '~/utils/texts';

import OrderModal from './OrderModal';

const Order = ({ order }: { order: IOrder }) => {
  const [isOpened, setOpened] = useState<boolean>(false);
  const [html, setHTML] = useState<string>();

  const closeModal = () => setOpened(false);

  const openModal = () => {
    if (!order.uri) {
      ToastAndroid.show('Приказ готовится', ToastAndroid.SHORT);
      return;
    }
    getOrderHTML(order).then((orderHTML) => {
      if (!orderHTML) {
        ToastAndroid.show('Приказ не загружен!', ToastAndroid.SHORT);
        return;
      }
      setHTML(orderHTML);
      setOpened(true);
    });
  };

  return (
    <>
      {isOpened && <OrderModal html={html} closeModal={closeModal} />}

      <TouchableOpacity onPress={openModal}>
        <CardHeaderIn topText={`№${order.id ?? '-'} от ${order.date}`}>
          <Text style={styles.textTitle}>{order.name}</Text>

          {!order.uri && <Text style={styles.textTitle}>Приказ готовится...</Text>}
        </CardHeaderIn>
      </TouchableOpacity>
    </>
  );
};

export default Order;

const styles = StyleSheet.create({
  textTitle: {
    fontWeight: '500',
    ...fontSize.small,
  },
});
