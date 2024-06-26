export interface IDisciplineReminder {
  datetime: string;
  // Дата и время напоминания в формате ISO
  notificationId: string;
  // Идентификатор запланированного уведомления
}

export interface IDisciplineTask {
  id: string;
  // Id задания
  disciplineName: string;
  // Название дисциплины
  description: string;
  // Описание задания
  datetime: string | null;
  // Дата и время пары, к которому было создано задание в формате ISO
  reminders: IDisciplineReminder[];
  // Список напоминаний к заданию
  isComplete: boolean;
  // Является ли задание выполненным
}

export interface IDisciplineInfo {
  name: string;
  // Название дисциплины
  note: string;
  // Заметка дисциплины
}
