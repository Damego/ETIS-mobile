// Интерфейс для заказа справки в ЕТИС
export interface CertificateRequest {
  // Идентификатор справки
  certificateId: string;
  // Примечание к справке
  note: string;
  // Место предъявление справки
  place: string;
  // Количество экземпляров справки
  quantity: string;
  // Способ доставки справки
  delivery: string;
}

export interface ICertificateDeliveryMethod {
  // Идентификатор метода заказа справки
  id: string;
  // Название метода доставки справки
  name: string;
}

// Интерфейс для объекта справки
export interface CertificateParam {
  // Идентификатор справки
  id: string;
  // Название справки
  name: string;
  // Есть ли возможность написать примечание к справке
  note: boolean;
  // Максимальное количество экземпляров для заказа
  maxQuantity: number;
  // Место предьявления справки
  place: boolean;
  // Спобоб доставки справки
  deliveryMethod: ICertificateDeliveryMethod[];
}
