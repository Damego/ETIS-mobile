import { CertificateParam } from '~/models/certificateRequest';

// Способы получения справки
export const DELIVERY_METHODS = [{ id: '1', name: 'лично (в отделе кадров обучающихся)' }];

// Справки, доступные для заказа в ЕТИС
export const KNOWN_CERTIFICATES: CertificateParam[] = [
  {
    id: '13',
    name: 'Справка, подтверждающая факт обучения в ПГНИУ',
    note: true,
    maxQuantity: 3,
    place: false,
    deliveryMethod: DELIVERY_METHODS,
  },
  {
    id: '7',
    name: 'Справка-вызов (без оплаты)',
    note: true,
    maxQuantity: 1,
    place: true,
    deliveryMethod: DELIVERY_METHODS,
  },
  {
    id: '5',
    name: 'Справка в Сбербанк',
    note: true,
    maxQuantity: 3,
    deliveryMethod: DELIVERY_METHODS,
    place: false,
  },
  {
    id: '12',
    name: 'Справка для оформления банковской карты платежной системы МИР',
    note: true,
    maxQuantity: 1,
    place: false,
    deliveryMethod: DELIVERY_METHODS,
  },
];

// Справки, которые заказываются в обход ЕТИС
export const SPECIAL_CERTIFICATES: CertificateParam[] = [
  {
    id: '-1',
    name: 'Справка о доходах (стипендии)',
    note: false,
    maxQuantity: 0,
    place: false,
    deliveryMethod: [],
  },
];
