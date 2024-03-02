import { IAbsence, IAbsenceSession } from '../models/absences';
import { ICalendarSchedule } from '../models/calendarSchedule';
import {
  ICathedraTimetable,
  ICathedraTimetablePayload,
  TimetableTypes,
} from '../models/cathedraTimetable';
import { ICertificateTable } from '../models/certificate';
import { IMessagesData, MessageType } from '../models/messages';
import { IOrder } from '../models/order';
import { IPersonalRecord } from '../models/personalRecords';
import { IPointUpdates } from '../models/pointUpdates';
import { ISessionRating } from '../models/rating';
import { GetResultType, IGetPayload, IGetResult } from '../models/results';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';
import { ISessionQuestionnaire, ISessionQuestionnaireLink } from '../models/sessionQuestionnaire';
import { ISessionTeachPlan } from '../models/teachPlan';
import { TeacherType } from '../models/teachers';
import { DistancePlatformTypes, ITimeTable, WeekTypes } from '../models/timeTable';
import { StudentInfo } from '../parser/menu';
import bind from '../utils/methodBinder';
import { BaseClient } from './base';
import { toResult } from './utils';

export default class DemoClient implements BaseClient {
  constructor() {
    bind(this, DemoClient);
  }

  async getSessionQuestionnaireList(): Promise<IGetResult<ISessionQuestionnaireLink[]>> {
    const data: ISessionQuestionnaireLink[] = [
      { url: '1', name: 'Математический анализ (Иванов И. И.)' },
      {
        name: 'Комплексный анализ (лаб) (Иванов А. И.)',
      },
      {
        name: 'Комплексный анализ (практ) (Иванов И. И.)',
      },
      {
        name: 'Комплексный анализ (лек) (Иванов И. А.)',
      },
    ];
    return this.toResult(data);
  }

  async getSessionQuestionnaire(): Promise<IGetResult<ISessionQuestionnaire>> {
    const data: ISessionQuestionnaire =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./demo-questionnaire.json') as ISessionQuestionnaire;
    return this.toResult(data);
  }

  async getCertificateData(): Promise<IGetResult<ICertificateTable>> {
    return toResult({
      certificates: [
        {
          date: '01.01.2023',
          deliveryMethod: '1',
          status: 'справка готова',
          name: 'Справка, подтверждающая факт обучения в ПГНИУ',
          id: '042',
        },
      ],
      announce: {
        footer: `Справки обучающимся готовятся в течение 3 рабочих дней, с даты поступления заявки.
Готовые справки можно получить в отделе кадров обучающихся (ОКО) 
(не путать с отделом кадров сотрудников)

корпус № 8 ПГНИУ каб.214
Часы работы с 8.30 по 17.30 (пятница до 16.30).
Суббота, воскресенье - выходной
Обед с 12.00 до 13.00
Телефон: (342) 2-396-135
Просим отслеживать статус заявки в личном кабинете!
`,
      },
    });
  }

  toResult<T>(data: T): IGetResult<T> {
    return {
      type: GetResultType.cached,
      data,
    };
  }

  async getTimeTableData(payload: IGetPayload<number>): Promise<IGetResult<ITimeTable>> {
    const data: ITimeTable = {
      days: [],
      weekInfo: {
        first: 1,
        last: 5,
        selected: payload?.data || 2,
        type: payload.data === 1 ? WeekTypes.holiday : WeekTypes.common,
        dates: {
          start: '01.01.2023',
          end: '07.01.2023',
        },
        holidayDates: {
          start: '01.01.2023',
          end: '07.01.2023',
        },
      },
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
    for (let i = 1; i <= 7; i += 1) {
      data.days.push({
        date: `${dayOfWeek[i - 1]}, ${i} сентября`,
        pairs:
          i <= 2
            ? [
                {
                  position: 1,
                  time: '8:00',
                  lessons: [
                    {
                      audienceText: 'ауд. 411/2 (2 корпус, 3 этаж)',
                      audience: '411/2',
                      floor: '3',
                      building: '2',
                      isDistance: false,
                      subject: 'Математический анализ (лек)',
                      teacher: {
                        id: '0',
                        name: 'Иванов И.П',
                      },
                    },
                  ],
                },
                {
                  position: 2,
                  time: '9:45',
                  lessons: [
                    {
                      audienceText: 'ауд. 411/2 (2 корпус, 3 этаж)',
                      audience: '411/2',
                      floor: '3',
                      building: '2',
                      isDistance: false,
                      subject: 'Комплексный анализ (лек)',
                      teacher: {
                        id: '1',
                        name: 'Иванов П.И',
                      },
                    },
                  ],
                },
                {
                  position: 3,
                  time: '11: 30',
                  lessons: [
                    {
                      audienceText: 'ауд. 411/2 (2 корпус, 3 этаж)',
                      audience: '411/2',
                      floor: '3',
                      building: '2',
                      isDistance: false,
                      subject: 'Функциональный анализ (лек)',
                      teacher: {
                        id: '0',
                        name: 'Иванов И.П',
                      },
                    },
                    {
                      audienceText: 'ауд. Дистанционно (on-line корпус)',
                      audience: 'Дистанционно',
                      floor: undefined,
                      building: 'on-line',
                      isDistance: true,
                      subject: 'Программный анализ (лек)',
                      teacher: {
                        id: '0',
                        name: 'Иванов И.П',
                      },
                    },
                  ],
                },
                {
                  position: 4,
                  time: '13:30',
                  lessons: [
                    {
                      audienceText: 'ауд. Дистанционно (on-line корпус)',
                      audience: 'Дистанционно',
                      floor: undefined,
                      building: 'on-line',
                      isDistance: true,
                      subject: 'Программный анализ (лек)',
                      teacher: {
                        id: '0',
                        name: 'Иванов И.П',
                      },
                      distancePlatform: {
                        name: 'Платформа BBB',
                        url: 'https://bigbluebutton.org/',
                        type: DistancePlatformTypes.bbb,
                        imageUrl: '',
                      },
                    },
                  ],
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

    return this.toResult(data);
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

  async getOrdersData(): Promise<IGetResult<IOrder[]>> {
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

  async getRatingData(): Promise<IGetResult<ISessionRating>> {
    const data: ISessionRating = {
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
        sessionName: 'триместр',
        course: 1,
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

  async getSessionSignsData(): Promise<IGetResult<ISessionPoints>> {
    const data: ISessionPoints = {
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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
              updatesUrl: '',
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

  async getPointUpdates(): Promise<IGetResult<IPointUpdates>> {
    return this.toResult({ url: '', date: '24.12.2023' });
  }

  async getStudentInfoData(): Promise<IGetResult<StudentInfo>> {
    const data: StudentInfo = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      student: (await this.getPersonalRecords()).data[0],
      announceCount: 2,
      messageCount: 1,
      sessionTestID: '',
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

  async getTeacherData(): Promise<IGetResult<TeacherType>> {
    const data: TeacherType = [
      [
        'Математический анализ',
        [
          {
            id: '0',
            cathedraId: '0',
            photo: 'img_peo_pkg.get_d_img',
            name: 'Иванов Иван Петрович',
            cathedra: 'Кафедра фундаментальной математики',
            subjectUntyped: 'Математический анализ',
            subjectType: 'лек, практ',
            photoTitle: 'Фотография загружена 01.01.2000',
          },
          {
            id: '1',
            cathedraId: '0',
            photo: 'img_peo_pkg.get_d_img',
            name: 'Иванов Петр Иванович',
            cathedra: 'Кафедра фундаментальной математики',
            subjectUntyped: 'Математический анализ',
            subjectType: 'экзамен',
            photoTitle: 'Фотография загружена 01.01.2000',
          },
        ],
      ],
      [
        'Комплексный анализ',
        [
          {
            id: '0',
            cathedraId: '0',
            photo: 'img_peo_pkg.get_d_img',
            name: 'Иванов Иван Петрович',
            cathedra: 'Кафедра фундаментальной математики',
            subjectUntyped: 'Комплексный анализ',
            subjectType: 'практ',
            photoTitle: 'Фотография загружена 01.01.2000',
          },
          {
            id: '1',
            cathedraId: '0',
            photo: 'img_peo_pkg.get_d_img',
            name: 'Иванов Петр Иванович',
            cathedra: 'Кафедра фундаментальной математики',
            subjectUntyped: 'Комплексный анализ',
            subjectType: 'лек, зачет',
            photoTitle: 'Фотография загружена 01.01.2000',
          },
        ],
      ],
      [
        'Функциональный анализ',
        [
          {
            id: '0',
            cathedraId: '0',
            photo: 'img_peo_pkg.get_d_img',
            name: 'Иванов Иван Петрович',
            cathedra: 'Кафедра фундаментальной математики',
            subjectUntyped: 'Комплексный анализ',
            subjectType: 'лек, практ, зачет',
            photoTitle: 'Фотография загружена 01.01.2000',
          },
        ],
      ],
    ];
    return this.toResult(data);
  }

  async getCalendarScheduleData() {
    const data: ICalendarSchedule = {
      course: 1,
      sessions: [
        {
          title: 'Осенний триместр',
          dates: [
            '01.09.2022 - 03.11.2022 теоретическое обучение',
            '04.11.2022 - 04.11.2022 нерабочие праздничные дни',
            '05.11.2022 - 17.12.2022 теоретическое обучение',
            '18.12.2022 - 24.12.2022 теоретическое обучение и промежуточная аттестация',
            '25.12.2022 - 31.12.2022 каникулы',
            '01.01.2023 - 08.01.2023 нерабочие праздничные дни',
          ],
        },
        {
          title: 'Весенний триместр',
          dates: [
            '09.01.2023 - 22.02.2023 теоретическое обучение',
            '23.02.2023 - 23.02.2023 нерабочие праздничные дни',
            '24.02.2023 - 07.03.2023 теоретическое обучение',
            '08.03.2023 - 08.03.2023 нерабочие праздничные дни',
            '09.03.2023 - 23.04.2023 теоретическое обучение',
            '24.04.2023 - 30.04.2023 теоретическое обучение и промежуточная аттестация',
            '01.05.2023 - 01.05.2023 нерабочие праздничные дни',
            '02.05.2023 - 08.05.2023 каникулы',
            '09.05.2023 - 09.05.2023 нерабочие праздничные дни',
            '10.05.2023 - 10.05.2023 каникулы',
          ],
        },
        {
          title: 'Летний триместр',
          dates: [
            '11.05.2023 - 11.06.2023 учебная рассредоточенная практика',
            '12.06.2023 - 12.06.2023 нерабочие праздничные дни',
            '13.06.2023 - 29.06.2023 учебная рассредоточенная практика',
            '30.06.2023 - 06.07.2023 теоретическое обучение и промежуточная аттестация',
            '07.07.2023 - 20.07.2023 изучение факультативных дисциплин',
            '21.07.2023 - 31.08.2023 каникулы',
          ],
        },
      ],
    };

    return this.toResult(data);
  }

  async getAbsencesData(payload: IGetPayload<number>): Promise<IGetResult<IAbsence>> {
    let currentSession: IAbsenceSession;
    if (!payload.data || payload.data === 1) {
      currentSession = { name: 'Осенний триместр', number: 1 };
    } else if (payload.data === 2) {
      currentSession = { name: 'Весенний триместр', number: 2 };
    } else if (payload.data === 3) {
      currentSession = { name: 'Летний триместр', number: 3 };
    }
    const data: IAbsence = {
      overallMissed: 3,
      currentSession,
      sessions: [
        { name: 'Осенний триместр', number: 1 },
        { name: 'Весенний триместр', number: 2 },
        { name: 'Летний триместр', number: 3 },
      ],
      absences: [
        {
          subject: 'Технологический анализ',
          type: 'Проведение практический занятий семинаров',
          teacher: 'Иванов Иван Иванович',
          dates: [
            {
              date: '19.09.2023',
              isCovered: false,
            },
            {
              date: '20.09.2023',
              isCovered: true,
            },
          ],
        },
        {
          subject: 'Физиологический анализ',
          type: 'Проведение практический занятий семинаров',
          teacher: 'Иванов Иван Иванович',
          dates: [
            {
              date: '21.09.2023',
              isCovered: false,
            },
          ],
        },
      ],
    };

    return this.toResult(data);
  }

  async getPersonalRecords(): Promise<IGetResult<IPersonalRecord[]>> {
    return this.toResult([
      {
        index: 0,
        status: 'студент',
        name: 'Лейбниц Готфрид Вильгельм',
        group: 'Математика-1',
        speciality: 'Математика',
        educationForm: 'Очная',
        faculty: 'Математический',
        year: '1675',
      },
      {
        id: '0',
        index: 1,
        status: 'студент',
        name: 'Лейбниц Готфрид Вильгельм',
        group: 'Математика-1',
        speciality: 'Механика',
        educationForm: 'Очная',
        faculty: 'Математический',
        year: '1685',
      },
      {
        id: '1',
        index: 2,
        status: 'отчислен',
        name: 'Лейбниц Готфрид Вильгельм',
        group: 'Математика-1',
        speciality: 'Арифметика',
        educationForm: 'Очная',
        faculty: 'Математический',
        year: '1665',
      },
    ]);
  }

  async getCathedraTimetable(
    payload: IGetPayload<ICathedraTimetablePayload>
  ): Promise<IGetResult<ICathedraTimetable>> {
    // eslint-disable-next-line import/no-dynamic-require
    let data: ICathedraTimetable;
    if (payload.data.teacherId) data = require('./teacherTimetable.json');
    else data = require('./cathedraTimetable.json');

    if (payload.data.session) {
      data.type = TimetableTypes.sessions;
      data.sessions.forEach((session) => {
        session.isCurrent = session.number === payload.data.session;
      });
    } else if (payload.data.week) {
      data.type = TimetableTypes.weeks;
      data.weekInfo.selected = payload.data.week;
    }

    return this.toResult(data);
  }
}
