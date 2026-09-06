import i18next from '~/i18n';
import { CertificateParam } from '~/models/certificateRequest';

// Способы получения справки
export const DELIVERY_METHODS = [
  { id: '1', name: i18next.t('certificate.delivery.personally') }
];

// Справки, доступные для заказа в ЕТИС
export const KNOWN_CERTIFICATES: CertificateParam[] = [
  {
    id: '13',
    name: i18next.t('certificate.types.studyFact'),
    note: true,
    maxQuantity: 3,
    place: false,
    deliveryMethod: DELIVERY_METHODS,
  },
  {
    id: '7',
    name: i18next.t('certificate.types.summons'),
    note: true,
    maxQuantity: 1,
    place: true,
    deliveryMethod: DELIVERY_METHODS,
  },
  {
    id: '5',
    name: i18next.t('certificate.types.sberbank'),
    note: true,
    maxQuantity: 3,
    deliveryMethod: DELIVERY_METHODS,
    place: false,
  },
  {
    id: '12',
    name: i18next.t('certificate.types.mirCard'),
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
    name: i18next.t('certificate.types.income'),
    note: false,
    maxQuantity: 0,
    place: false,
    deliveryMethod: [],
  },
];
