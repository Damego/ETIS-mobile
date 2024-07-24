// Итоговая справка
export interface ICertificate {
  // Дата заказа
  date: string;
  // Название справки
  name: string;
  // Идентификатор справки
  id: string;
  // Статус заказа справки
  status: string;

  /* Поля ниже доступны только после полного парсинга */

  // Пример содержания справки
  example?: string;
  // Количество заказанных экземпляров справки
  quantity?: number;
  // Метод вручения справки
  deliveryMethod?: string;
}

// Объявления
export interface ICertificateAnnounce {
  header?: string;
  footer?: string;
}

// Доступная студенту справка для заявки
export interface IAvailableCertificate {
  // Идентификатор справки
  id: string;
  // Название справки
  name: string;
}

// Интерфейс данных справки
export interface ICertificateResult {
  announce: ICertificateAnnounce;
  certificates: ICertificate[];
  availableCertificates: IAvailableCertificate[];
}
