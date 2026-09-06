import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';

import CardHeaderIn from '~/components/CardHeaderIn';
import Text from '~/components/Text';
import { getOrderHTML } from '~/data/orders';
import { IOrder } from '~/models/order';
import { fontSize } from '~/utils/texts';

import OrderModal from './OrderModal';

const Order = ({ order }: { order: IOrder }) => {
  const { t } = useTranslation();
  const [isOpened, setOpened] = useState<boolean>(false);
  const [html, setHTML] = useState<string>();

  const closeModal = () => setOpened(false);

  const openModal = () => {
    if (!order.uri) {
      ToastAndroid.show(t('orders.preparing'), ToastAndroid.SHORT);
      return;
    }
    getOrderHTML(order).then((orderHTML) => {
      if (!orderHTML) {
        ToastAndroid.show(t('orders.loadFailed'), ToastAndroid.SHORT);
        return;
      }
      setHTML(orderHTML);
      setOpened(true);
    });
  };

  return (
    <>
      {isOpened && <OrderModal html={html ?? ''} closeModal={closeModal} />}

      <TouchableOpacity onPress={openModal}>
        <CardHeaderIn topText={t('orders.header', { id: order.id ?? '-', date: order.date })}>
          <Text style={styles.textTitle}>{order.name}</Text>

          {!order.uri && <Text style={styles.textTitle}>{t('orders.preparingInline')}</Text>}
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
