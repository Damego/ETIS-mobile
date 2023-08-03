import { GetResultType, IGetPayload, IGetResult } from '../models/results';
import { BaseClient } from './base';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { IMessagesData, MessageType } from '../models/messages';
import { IOrder } from '../models/order';
import { IRating } from '../models/rating';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionSignsData } from '../models/sessionPoints';
import { MenuParseResult } from '../parser/menu';
import { ISessionTeachPlan } from '../models/teachPlan';
import { TeacherType } from '../models/teachers';

export default class DemoClient implements BaseClient {
  toResult<T>(data: T): IGetResult<T> {
    return {
      type: GetResultType.cached,
      data,
    };
  }

  async getTimeTableData(payload: ITimeTableGetProps): Promise<IGetResult<ITimeTable>> {
    const data: ITimeTable = {
      firstWeek: 1,
      lastWeek: 5,
      selectedWeek: payload?.week,
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

    return this.toResult(data);
  }

  async getAnnounceData(): Promise<IGetResult<string[]>> {
    const data = [
      '\n<li><font color="#808080">02.09.2023 12:00:00</font><br>\n<font style="font-weight:bold">Тестовое объявление!</font><br>\n<br>Как уже неоднократно упомянуто, активно развивающиеся страны третьего мира, превозмогая сложившуюся непростую экономическую ситуацию, превращены в посмешище, хотя само их существование приносит несомненную пользу обществу.</b><br><br><br>Создатели ETIS Mobile</li>\n',
      '\n<li><font color="#808080">01.09.2023 12:00:28</font><br>\n<font style="font-weight:bold">Другое тестовое объявление</font><br>\n<br>Современные технологии достигли такого уровня, что высококачественный прототип будущего проекта способствует повышению качества существующих финансовых и административных условий.</b><br><br><br>Создатели ETIS Mobile</li>\n',
    ];

    return {
      type: GetResultType.fetched,
      data,
    };
  }

  async getMessagesData(): Promise<IGetResult<IMessagesData>> {
    const data: IMessagesData = {
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
    };
    return this.toResult(data);
  }

  async getOrdersData(payload: IGetPayload): Promise<IGetResult<IOrder[]>> {
    const data: IOrder[] = [
      {
        id: '1',
        date: '01.09.2023',
        name: 'Зачислить',
      },
      {
        date: '02.09.2023',
        name: 'Отчислить',
      },
    ];
    return this.toResult(data);
  }

  async getRatingData(): Promise<IGetResult<IRating>> {
    const data: IRating = {
      session: {
        current: 1,
        latest: 1,
        name: 'триместр',
      },
      groups: [
        {
          name: 'Математика-1',
          overall: { top: 1, total: 30 },
          disciplines: [
            {
              discipline: 'Математический анализ',
              controlPoints: 10,
              passedControlPoints: 10,
              points: 10,
              top: 1,
              total: 30,
            },
          ],
        },
      ],
    };
    return this.toResult(data);
  }

  async getSessionMarksData(): Promise<IGetResult<ISessionMarks[]>> {
    const data: ISessionMarks[] = [
      {
        session: 1,
        course: 1,
        fullSessionNumber: 1,
        endDate: '30 декабря',
        disciplines: [
          {
            name: 'Математический анализ',
            mark: '5',
            date: '30 декабря',
            teacher: 'Иванов И.И.',
          },
          {
            name: 'Комплексный анализ',
            mark: 'зачет',
            date: '30 декабря',
            teacher: 'Иванов И.И.',
          },
        ],
      },
    ];
    return this.toResult(data);
  }

  async getSessionSignsData(): Promise<IGetResult<ISessionSignsData>> {
    const data: ISessionSignsData = {
      subjects: [
        {
          checkPoints: [
            {
              theme: 'КТ 3',
              typeWork: 'практ',
              typeControl: 'письменное контрольное мероприятие',
              points: 30,
              isAbsent: false,
              passScore: 13,
              currentScore: 30,
              maxScore: 30,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: true,
              failed: false,
            },
            {
              theme: 'КТ 4',
              typeWork: 'практ',
              typeControl: 'письменное контрольное мероприятие',
              points: 30,
              isAbsent: false,
              passScore: 13,
              currentScore: 30,
              maxScore: 30,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: true,
              failed: false,
            },
            {
              theme: 'ИКМ 2',
              typeWork: 'лек',
              typeControl: 'итоговое контрольное мероприятие',
              points: 21,
              isAbsent: false,
              passScore: 17,
              currentScore: 21,
              maxScore: 40,
              isIntroductionWork: false,
              date: '05.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: true,
              failed: false,
            },
          ],
          totalPoints: 81,
          mark: '5',
          name: 'Математический анализ',
        },
        {
          checkPoints: [
            {
              theme: 'КТ 3',
              typeWork: 'практ',
              typeControl: 'письменное контрольное мероприятие',
              points: 30,
              isAbsent: false,
              passScore: 13,
              currentScore: 20,
              maxScore: 20,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: true,
              failed: false,
            },
            {
              theme: 'КТ 4',
              typeWork: 'практ',
              typeControl: 'письменное контрольное мероприятие',
              points: 20,
              isAbsent: false,
              passScore: 13,
              currentScore: 20,
              maxScore: 30,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: true,
              failed: false,
            },
            {
              theme: 'ИКМ 2',
              typeWork: 'лек',
              typeControl: 'итоговое контрольное мероприятие',
              points: 21,
              isAbsent: false,
              passScore: 17,
              currentScore: 21,
              maxScore: 40,
              isIntroductionWork: false,
              date: '05.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: true,
              failed: false,
            },
          ],
          totalPoints: 61,
          mark: null,
          name: 'Комплексный анализ',
        },
        {
          checkPoints: [
            {
              theme: 'КТ 3',
              typeWork: 'практ',
              typeControl: 'письменное контрольное мероприятие',
              points: 13,
              isAbsent: false,
              passScore: 13,
              currentScore: 13,
              maxScore: 20,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: true,
              failed: false,
            },
            {
              theme: 'КТ 4',
              typeWork: 'практ',
              typeControl: 'письменное контрольное мероприятие',
              points: 13,
              isAbsent: false,
              passScore: 13,
              currentScore: 13,
              maxScore: 30,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: true,
              failed: false,
            },
            {
              theme: 'ИКМ 2',
              typeWork: 'лек',
              typeControl: 'итоговое контрольное мероприятие',
              points: 17,
              isAbsent: false,
              passScore: 17,
              currentScore: 17,
              maxScore: 40,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: true,
              failed: false,
            },
          ],
          totalPoints: 43,
          mark: null,
          name: 'Функциональный анализ',
        },
        {
          checkPoints: [
            {
              theme: 'КТ 3',
              typeWork: 'практ',
              typeControl: 'письменное контрольное мероприятие',
              points: 13,
              isAbsent: false,
              passScore: 13,
              currentScore: 13,
              maxScore: 20,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: false,
              failed: false,
            },
            {
              theme: 'КТ 4',
              typeWork: 'практ',
              typeControl: 'письменное контрольное мероприятие',
              points: 0,
              isAbsent: true,
              passScore: 13,
              currentScore: 0,
              maxScore: 30,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: false,
              failed: true,
            },
            {
              theme: 'ИКМ 2',
              typeWork: 'лек',
              typeControl: 'итоговое контрольное мероприятие',
              points: 0,
              isAbsent: true,
              passScore: 17,
              currentScore: 0,
              maxScore: 40,
              isIntroductionWork: false,
              date: '01.10.2023',
              teacher: 'Иванов И. И.',
              hasPoints: false,
              failed: true,
            },
          ],
          totalPoints: 13,
          mark: null,
          name: 'Нестандартный анализ',
        },
      ],
      currentSession: 1,
      latestSession: 1,
      sessionName: 'триместр',
    };
    return this.toResult(data);
  }

  async getStudentInfoData(): Promise<IGetResult<MenuParseResult>> {
    const data: MenuParseResult = {
      studentInfo: {
        name: 'Лейбниц Готфрид Вильгельм',
        group: 'Математика-1',
        speciality: 'Математика',
        educationForm: 'Очная',
        year: '1675',
      },
      announceCount: 2,
      messageCount: 1,
    };
    return this.toResult(data);
  }

  async getTeachPlanData(): Promise<IGetResult<ISessionTeachPlan[]>> {
    const data: ISessionTeachPlan[] = [
      {
        stringSession: '1 триместр',
        disciplines: [
          {
            name: 'Математический анализ',
            reporting: 'оценка',
            classWorkHours: 500,
            soloWorkHours: 500,
            totalWorkHours: 1000,
          },
          {
            name: 'Комплексный анализ',
            reporting: 'зачет',
            classWorkHours: 500,
            soloWorkHours: 500,
            totalWorkHours: 1000,
          },
          {
            name: 'Функциональный анализ',
            reporting: 'зачет',
            classWorkHours: 500,
            soloWorkHours: 500,
            totalWorkHours: 1000,
          },
          {
            name: 'Нестандартный анализ',
            reporting: 'зачет',
            classWorkHours: 500,
            soloWorkHours: 500,
            totalWorkHours: 1000,
          },
        ],
      },
    ];
    return this.toResult(data);
  }

  async getTeacherData(payload: IGetPayload): Promise<IGetResult<TeacherType>> {
    const data: TeacherType = []; // TODO: add data
    return this.toResult(data);
  }
}