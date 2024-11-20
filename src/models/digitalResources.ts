export interface IDigitalResource {
  // Название электронного ресурса
  name: string;
  // Ссылка на электронный ресурс
  url?: string;
  // Логин от учётной записи
  login?: string;
  // Пароль от учётной записи
  password?: string;
  // Код доступа к электронному ресурсу
  accessCode?: string;
  // Категория электронного ресурса
  category: string;
}
