import i18next from '~/i18n';
import { CertificateParam } from '~/models/certificateRequest';

// Способы получения справки
export const getCertificateData = () => {
  const deliveryMethods = [
    { id: '1', name: i18next.t('certificate.delivery.personally') }
  ];

  // Справки, доступные для заказа в ЕТИС
  const knownCertificates: CertificateParam[] = [
    {
      id: '13',
      name: i18next.t('certificate.types.studyFact'),
      note: true,
      maxQuantity: 3,
      place: false,
      deliveryMethod: deliveryMethods,
    },
    {
      id: '7',
      name: i18next.t('certificate.types.summons'),
      note: true,
      maxQuantity: 1,
      place: true,
      deliveryMethod: deliveryMethods,
    },
    {
      id: '5',
      name: i18next.t('certificate.types.sberbank'),
      note: true,
      maxQuantity: 3,
      deliveryMethod: deliveryMethods,
      place: false,
    },
    {
      id: '12',
      name: i18next.t('certificate.types.mirCard'),
      note: true,
      maxQuantity: 1,
      place: false,
      deliveryMethod: deliveryMethods,
    },
  ];

  // Справки, которые заказываются в обход ЕТИС
  const specialCertificates: CertificateParam[] = [
    {
      id: '-1',
      name: i18next.t('certificate.types.income'),
      note: false,
      maxQuantity: 0,
      place: false,
      deliveryMethod: [],
    },
  ];

  return { deliveryMethods, knownCertificates, specialCertificates };
};
