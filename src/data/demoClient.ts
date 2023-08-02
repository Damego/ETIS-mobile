import { GetResultType, IGetPayload, IGetResult } from '../models/results';
import { BaseClient } from './base';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { IGetMessagesPayload, IMessagesData, MessageType } from '../models/messages';

export default class DemoClient implements BaseClient {
  async getTimeTableData(payload: ITimeTableGetProps): Promise<IGetResult<ITimeTable>> {
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

  async getAnnounceData(payload: IGetPayload): Promise<IGetResult<string[]>> {
    const data = [
      '\n<li><font color="#808080">02.09.2023 12:00:00</font><br>\n<font style="font-weight:bold">Тестовое объявление!</font><br>\n<br>Как уже неоднократно упомянуто, активно развивающиеся страны третьего мира, превозмогая сложившуюся непростую экономическую ситуацию, превращены в посмешище, хотя само их существование приносит несомненную пользу обществу.</b><br><br><br>Создатели ETIS Mobile</li>\n',
      '\n<li><font color="#808080">01.09.2023 12:00:28</font><br>\n<font style="font-weight:bold">Другое тестовое объявление</font><br>\n<br>Современные технологии достигли такого уровня, что высококачественный прототип будущего проекта способствует повышению качества существующих финансовых и административных условий.</b><br><br><br>Создатели ETIS Mobile</li>\n',
    ];

    return {
      type: GetResultType.fetched,
      data,
    };
  }

  async getMessagesData(payload: IGetMessagesPayload): Promise<IGetResult<IMessagesData>> {
    return {
      type: GetResultType.fetched,
      data: {
        page: 1,
        lastPage: 1,
        messages: [
          [
            {
              type: MessageType.message,
              time: '01.09.2023 10:00:00',
              author: 'Создатели ETIS Mobile',
              subject: 'Приветствие',
              theme: null,
              content: 'Добрый день, Это тестовое объявление',
              files: [],
              answerID: '0',
              messageID: '0',
            },
            {
              type: MessageType.studentReply,
              time: '01.09.2023 12:00:00',
              files: [],
              content: 'Спасибо за объявление',
              answerMessageID: '0',
            },
            {
              type: MessageType.teacherReply,
              time: '01.09.2023 14:00:00',
              files: [],
              content: 'Приятного использования ETIS Mobile!',
              answerMessageID: '0',
            },
          ],
        ],
      },
    };
  }
}
