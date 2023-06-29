import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { getOrderHTML } from '../../data/orders';
import { useGlobalStyles } from '../../hooks';
import { IOrder } from '../../models/order';
import { fontSize } from '../../utils/texts';
import OrderModal from './OrderModal';

const styles = StyleSheet.create({
  fontW500: {
    fontWeight: '500',
  },
});

const Order = ({ order }: { order: IOrder }) => {
  const globalStyles = useGlobalStyles();

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
        ToastAndroid.show("Приказ не загружен!", ToastAndroid.SHORT);
        return;
      }
      setHTML(orderHTML);
    });
    setOpened(true);
  };

  return (
    <>
      {isOpened && <OrderModal html={html} closeModal={closeModal} />}

      <TouchableOpacity onPress={openModal}>
        <CardHeaderIn topText={`№${order.id ?? '-'} от ${order.date}`}>
          <Text style={[fontSize.small, styles.fontW500, globalStyles.textColor]}>
            {order.name}
          </Text>

          {!order.uri && (
            <Text style={[fontSize.small, styles.fontW500, globalStyles.textColor]}>
              Приказ готовится...
            </Text>
          )}
        </CardHeaderIn>
      </TouchableOpacity>
    </>
  );
};

export default Order;
