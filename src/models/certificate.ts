export enum CertificateStatus {
  ready = 'документ готов',
}

export interface ICertificate {
  date: string;
  name: string;
  id: string;
  status: string;
  // только после полного парсинга
  example?: string;
  quantity?: number;
  deliveryMethod?: string;
}

export interface ICertificateAnnounce {
  header?: string;
  footer?: string;
}

export interface ICertificateTable {
  announce: ICertificateAnnounce;
  certificates: ICertificate[];
}
