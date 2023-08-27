import { CertificateRequest } from '../models/CertificateRequest';

export interface CertificateRequestPayload {
  p_action: 'INSERT';
  p_crtt_id: string; // id справки
  p_copy: string; // кол-во копий
  p_crdt_id: string; // способ доставки
  p_addr: ''; // адрес доставки (?)
  p_cepl_id: ''; // (?)
  p_place: string; // место предоставления документа.
  p_stu_cmnt: string; // примечание
}

export function toCertificatePayload(certificate: CertificateRequest): CertificateRequestPayload {
  return {
    p_action: 'INSERT',
    p_cepl_id: '',
    p_addr: '',
    p_place: certificate.place || '',
    p_stu_cmnt: certificate.note || '',
    p_crdt_id: certificate.delivery,
    p_copy: certificate.quantity,
    p_crtt_id: certificate.certificateId,
  };
}
