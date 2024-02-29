export interface IDisciplineReminder {
  datetime: string;
  // Дата и время напоминания в формате ISO
}

export interface IDisciplineTask {
  id: number;
  // Id задания
  disciplineName: string;
  // Название дисциплины
  description: string;
  // Описание задания
  datetime: string;
  // Дата и время пары, к которому было создано задание в формате ISO
  reminders: IDisciplineReminder[];
  // Список напоминаний к заданию
}

export interface IDisciplineInfo {
  name: string;
  // Название дисциплины
  note: string;
  // Заметка дисциплины
}
