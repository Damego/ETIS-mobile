import { GetPayload, GetResultType, IGetResult } from '../models/results';
import { BaseClient } from './base';
import { GetTimeTablePayload } from './types';
import { ITimeTable } from '../models/timeTable';

export default class DemoClient implements BaseClient {
  async getTimeTableData(payload: GetTimeTablePayload): Promise<IGetResult<ITimeTable>> {
    const data: ITimeTable = {
      firstWeek: 1,
      lastWeek: 5,
      selectedWeek: 1,
      days: [],
    };
    const dayOfWeek = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье',
    ];
    for (let i = 1; i <= 7; i++) {
      data.days.push({
        date: `${dayOfWeek[i - 1]}, ${i} сентября`,
        lessons:
          i <= 2
            ? [
                {
                  audience: 'ауд. 411/2 (2 корпус, 3 этаж)',
                  subject: 'Математический анализ (лек)',
                  time: '8:00',
                  lessonPosition: 1,
                },
                {
                  audience: 'ауд. 411/2 (2 корпус, 3 этаж)',
                  subject: 'Комплексный анализ (лек)',
                  time: '9:45',
                  lessonPosition: 2,
                },
                {
                  audience: 'ауд. 411/2 (2 корпус, 3 этаж)',
                  subject: 'Функциональный анализ (лек)',
                  time: '11:30',
                  lessonPosition: 3,
                },
              ]
            : [],
      });
    }

    return {
      type: GetResultType.fetched,
      data,
    };
  }
  async getAnnounceData(payload: GetPayload): Promise<IGetResult<string[]>> {
    const data = ['Объявление тест раз', 'Объявление два'];

    return {
      type: GetResultType.fetched,
      data,
    };
  }
}
