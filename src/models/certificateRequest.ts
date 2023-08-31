export interface CertificateRequest {
  certificateId: string;
  note: string;
  place: string;
  quantity: string;
  delivery: string;
}

export interface CertificateParam {
  id: string;
  name: string;
  note: boolean;
  maxQuantity: number;
  place: boolean; // место предъявления
  deliveryMethod: { id: string; name: string }[];
}
