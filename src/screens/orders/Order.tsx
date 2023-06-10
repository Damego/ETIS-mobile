import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { getOrderHTML } from '../../data/orders';
import { useGlobalStyles } from '../../hooks';
import { IOrder } from '../../models/order';
import OrderModal from './OrderModal';

const styles = StyleSheet.create({
  fontW500: {
    fontWeight: '500',
  },
  fontS14: {
    fontSize: 14,
  },
});

const Order = ({ order }: { order: IOrder }) => {
  const globalStyles = useGlobalStyles();

  const [isOpened, setOpened] = useState<boolean>(false);
  const [html, setHTML] = useState<string>();

  useEffect(() => {
    if (html || !isOpened) return;
    getOrderHTML(order).then((orderHTML) => setHTML(orderHTML));
  }, [isOpened]);

  const closeModal = () => setOpened(false);

  const openModal = () => {
    if (!order.uri) {
      ToastAndroid.show('Приказ готовится', ToastAndroid.SHORT);
      return;
    }
    setOpened(true);
  };

  return (
    <>
      {isOpened && <OrderModal html={html} closeModal={closeModal} />}

      <TouchableOpacity onPress={openModal}>
        <CardHeaderIn topText={`№${order.id} от ${order.date}`}>
          <Text style={[styles.fontS14, styles.fontW500, globalStyles.textColor]}>
            {order.name}
          </Text>

          {!order.uri && (
            <Text style={[styles.fontS14, styles.fontW500, globalStyles.textColor]}>
              Приказ готовится...
            </Text>
          )}
        </CardHeaderIn>
      </TouchableOpacity>
    </>
  );
};

export default Order;
