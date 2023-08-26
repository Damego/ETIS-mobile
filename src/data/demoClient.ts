import { ICalendarSchedule } from '../models/calendarSchedule';
import { IMessagesData, MessageType } from '../models/messages';
import { IOrder } from '../models/order';
import { ISessionRating } from '../models/rating';
import { GetResultType, IGetPayload, IGetResult } from '../models/results';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';
import { ISessionQuestionnaire, ISessionQuestionnaireLink } from '../models/sessionQuestionnaire';
import { ISessionTeachPlan } from '../models/teachPlan';
import { TeacherType } from '../models/teachers';
import { ITimeTable, ITimeTableGetProps } from '../models/timeTable';
import { StudentInfo } from '../parser/menu';
import { BaseClient } from './base';

export default class DemoClient implements BaseClient {
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
      require('./demo-questionnaire.json') as ISessionQuestionnaire;
    return this.toResult(data);
  }

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

  async getStudentInfoData(): Promise<IGetResult<StudentInfo>> {
    const data: StudentInfo = {
      student: {
        name: 'Лейбниц Готфрид Вильгельм',
        group: 'Математика-1',
        speciality: 'Математика',
        educationForm: 'Очная',
        year: '1675',
      },
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
            photo: 'img_peo_pkg.get_d_img',
            name: 'Иванов Иван Петрович',
            cathedra: 'Кафедра фундаментальной математики',
            subjectUntyped: 'Математический анализ',
            subjectType: 'лек, практ',
            photoTitle: 'Фотография загружена 01.01.2000',
          },
          {
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
            photo: 'img_peo_pkg.get_d_img',
            name: 'Иванов Иван Петрович',
            cathedra: 'Кафедра фундаментальной математики',
            subjectUntyped: 'Комплексный анализ',
            subjectType: 'практ',
            photoTitle: 'Фотография загружена 01.01.2000',
          },
          {
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
}
