import { useMemo } from 'react';
import { cache } from '~/cache/smartCache';
import { useAppSelector } from '~/hooks';
import { IAbsence } from '~/models/absences';
import { IAnnounce } from '~/models/announce';
import { ICalendarSchedule } from '~/models/calendarSchedule';
import { ICathedraTimetable, ICathedraTimetablePayload } from '~/models/cathedraTimetable';
import { ICertificateResult } from '~/models/certificate';
import {
  IDisciplineEducationalComplex,
  IDisciplineEducationalComplexPayload,
} from '~/models/disciplineEducationalComplex';
import {
  IDisciplineEducationalComplexTheme,
  IDisciplineEducationalComplexThemePayload,
} from '~/models/disciplineEducationalComplexTheme';
import { IGroupTimetablePayload } from '~/models/groupTimetable';
import { IMessagesData } from '~/models/messages';
import { IOrder } from '~/models/order';
import { IPersonalRecord } from '~/models/personalRecords';
import { IPointUpdates } from '~/models/pointUpdates';
import { ISessionRating } from '~/models/rating';
import { IGetPayload, IGetResult } from '~/models/results';
import { ISessionMarks } from '~/models/sessionMarks';
import { ISessionPoints } from '~/models/sessionPoints';
import { ISessionQuestionnaire, ISessionQuestionnaireLink } from '~/models/sessionQuestionnaire';
import { ISessionTeachPlan } from '~/models/teachPlan';
import { ITeacher } from '~/models/teachers';
import { ITimeTable } from '~/models/timeTable';
import {
  parseAbsenses,
  parseAnnounce,
  parseMenu,
  parseMessages,
  parseSessionMarks,
  parseSessionPoints,
  parseShortTeachPlan,
  parseTeachers,
  parseTimeTable,
} from '~/parser';
import parseCalendarSchedule from '~/parser/calendar';
import parseCathedraTimetable from '~/parser/cathedraTimetable';
import { parseCertificateTable } from '~/parser/certificate';
import { parseDisciplineEducationalComplex } from '~/parser/disciplineEducationalComplex';
import { parseDisciplineEducationalComplexTheme } from '~/parser/disciplineEducationalComplexTheme';
import { parseExamQuestions } from '~/parser/examQuestions';
import { parseGroupTimetable } from '~/parser/groupTimetable';
import { StudentInfo } from '~/parser/menu';
import parseOrders from '~/parser/order';
import parsePersonalRecords from '~/parser/personalRecords';
import parsePointUpdates from '~/parser/pointUpdates';
import parseRating from '~/parser/rating';
import parseSessionQuestionnaire from '~/parser/sessionQuestionnaire';
import parseSessionQuestionnaireList from '~/parser/sessionQuestionnaireList';
import { httpClient } from '~/utils';
import bind from '~/utils/methodBinder';

import { BaseClient, BasicClient } from './base';
import DemoClient from './demoClient';

export const useClient: () => BaseClient = () => {
  const { isDemo } = useAppSelector((state) => state.account);
  return useMemo(() => (isDemo ? new DemoClient() : new Client()), [isDemo]);
};

const emptyFunction = <T>() => undefined as T;

class AbsencesClient extends BasicClient<IGetPayload<number>, IAbsence> {}
class AnnounceClient extends BasicClient<IGetPayload, IAnnounce[]> {}
class TimeTableClient extends BasicClient<IGetPayload<number>, ITimeTable> {}
class MessageClient extends BasicClient<IGetPayload<number>, IMessagesData> {}
class OrderClient extends BasicClient<IGetPayload, IOrder[]> {}
class RatingClient extends BasicClient<IGetPayload<number>, ISessionRating> {}
class SignsClient extends BasicClient<IGetPayload<number>, ISessionPoints> {}
class PointUpdatesClient extends BasicClient<IGetPayload<string>, IPointUpdates> {}
class MarksClient extends BasicClient<IGetPayload, ISessionMarks[]> {}
class StudentClient extends BasicClient<IGetPayload, StudentInfo> {}
class TeachersClient extends BasicClient<IGetPayload, ITeacher[]> {}
class TeachPlanClient extends BasicClient<IGetPayload, ISessionTeachPlan[]> {}
class CalendarScheduleClient extends BasicClient<IGetPayload, ICalendarSchedule> {}
class CertificateClient extends BasicClient<IGetPayload, ICertificateResult> {}
class SessionQuestionnaireClient extends BasicClient<IGetPayload<string>, ISessionQuestionnaire> {}
class SessionQuestionnaireListClient extends BasicClient<
  IGetPayload<string>,
  ISessionQuestionnaireLink[]
> {}
class PersonalRecordsClient extends BasicClient<IGetPayload, IPersonalRecord[]> {}
class CathedraTimetableClient extends BasicClient<
  IGetPayload<ICathedraTimetablePayload>,
  ICathedraTimetable
> {}
class GroupTimetableClient extends BasicClient<IGetPayload<IGroupTimetablePayload>, ITimeTable> {}
class DisciplineEducationalComplexClient extends BasicClient<
  IGetPayload<IDisciplineEducationalComplexPayload>,
  IDisciplineEducationalComplex
> {}
class DisciplineEducationalComplexThemeClient extends BasicClient<
  IGetPayload<IDisciplineEducationalComplexThemePayload>,
  IDisciplineEducationalComplexTheme
> {}
class ExamQuestionsClient extends BasicClient<IGetPayload<string>, string> {}

export default class Client implements BaseClient {
  private absencesClient: AbsencesClient;
  private announceClient: AnnounceClient;
  private timeTableClient: TimeTableClient;
  private messageClient: MessageClient;
  private orderClient: OrderClient;
  private ratingClient: RatingClient;
  private signsClient: SignsClient;
  private pointUpdatesClient: PointUpdatesClient;
  private marksClient: MarksClient;
  private studentClient: StudentClient;
  private teacherClient: TeachersClient;
  private teachPlanClient: TeachPlanClient;
  private calendarScheduleClient: CalendarScheduleClient;
  private certificateClient: CertificateClient;
  private sessionQuestionnaireClient: SessionQuestionnaireClient;
  private sessionQuestionnaireListClient: SessionQuestionnaireListClient;
  private personalRecordsClient: PersonalRecordsClient;
  private cathedraTimetableClient: CathedraTimetableClient;
  private groupTimetableClient: GroupTimetableClient;
  private disciplineEducationalComplexClient: DisciplineEducationalComplexClient;
  private disciplineEducationalComplexThemeClient: DisciplineEducationalComplexThemeClient;
  private examQuestionsClient: ExamQuestionsClient;

  constructor() {
    this.absencesClient = new AbsencesClient(
      ({ data }) => cache.getAbsences(data),
      ({ data }) => httpClient.getAbsences(data),
      parseAbsenses,
      (data) => cache.placeAbsences(data)
    );
    this.announceClient = new AnnounceClient(
      () => cache.getAnnounce(),
      () => httpClient.getAnnounce(),
      parseAnnounce,
      (data) => cache.placeAnnounce(data)
    );
    this.timeTableClient = new TimeTableClient(
      ({ data }) => cache.getTimeTable(data),
      ({ data }) => httpClient.getTimeTable({ week: data }),
      parseTimeTable,
      (data) => cache.placeTimeTable(data)
    );
    this.messageClient = new MessageClient(
      ({ data }) => cache.getMessages(data),
      ({ data }) => httpClient.getMessages(data),
      parseMessages,
      (data) => cache.placeMessages(data)
    );
    this.orderClient = new OrderClient(
      () => cache.getOrders(),
      () => httpClient.getOrders(),
      parseOrders,
      (data) => cache.placeOrders(data)
    );
    this.ratingClient = new RatingClient(
      ({ data }) => cache.getSessionRating(data),
      ({ data }) => httpClient.getSigns('rating', data),
      parseRating,
      (data) => cache.placeSessionRating(data)
    );
    this.signsClient = new SignsClient(
      ({ data }) => cache.getSessionPoints(data),
      ({ data }) => httpClient.getSigns('current', data),
      parseSessionPoints,
      (data) => cache.placeSessionPoints(data)
    );
    this.pointUpdatesClient = new PointUpdatesClient(
      ({ data }) => cache.getPointUpdates(data),
      ({ data }) => httpClient.getPointUpdates(data),
      (data, { data: url }) => parsePointUpdates(data, url),
      (data) => cache.placePointUpdates(data)
    );
    this.marksClient = new MarksClient(
      () => cache.getAllSessionMarks(),
      () => httpClient.getSigns('session'),
      parseSessionMarks,
      (data) => cache.placeSessionMarks(data)
    );
    this.studentClient = new StudentClient(
      () => cache.getStudent(),
      () => httpClient.getGroupJournal(),
      (payload) => parseMenu(payload, true),
      (data) => cache.placePartialStudent(data)
    );
    this.teacherClient = new TeachersClient(
      () => cache.getTeachers(),
      () => httpClient.getTeachers(),
      parseTeachers,
      (data) => cache.placeTeachers(data)
    );
    this.teachPlanClient = new TeachPlanClient(
      () => cache.getTeachPlan(),
      () => httpClient.getTeachPlan(),
      parseShortTeachPlan,
      (data) => cache.placeTeachPlan(data)
    );
    this.calendarScheduleClient = new CalendarScheduleClient(
      () => cache.getCalendarSchedule(),
      () => httpClient.getTeachPlan('advanced'),
      parseCalendarSchedule,
      (data) => cache.placeCalendarSchedule(data)
    );
    this.certificateClient = new CertificateClient(
      () => cache.getCertificate(),
      () => httpClient.getCertificate(),
      parseCertificateTable,
      (data) => cache.placeCertificate(data)
    );
    this.sessionQuestionnaireClient = new SessionQuestionnaireClient(
      emptyFunction,
      (url) => httpClient.getSessionQuestionnaire(url.data),
      parseSessionQuestionnaire,
      emptyFunction
    );
    this.sessionQuestionnaireListClient = new SessionQuestionnaireListClient(
      emptyFunction,
      (url) => httpClient.getSessionQuestionnaireList(url.data),
      parseSessionQuestionnaireList,
      emptyFunction
    );
    this.personalRecordsClient = new PersonalRecordsClient(
      () => cache.getPersonalRecords(),
      () => httpClient.getPersonalRecords(),
      parsePersonalRecords,
      (data) => cache.placePersonalRecords(data)
    );
    this.cathedraTimetableClient = new CathedraTimetableClient(
      (payload) => cache.getCathedraTimetable(payload.data),
      (payload) => httpClient.getCathedraTimetable(payload.data),
      parseCathedraTimetable,
      (data, payload) => cache.placeCathedraTimetable(payload.data, data)
    );
    this.groupTimetableClient = new GroupTimetableClient(
      (payload) => cache.getGroupTimetable(payload.data),
      (payload) => httpClient.getGroupTimetable(payload.data),
      parseGroupTimetable,
      (data, payload) => cache.placeGroupTimetable(payload.data, data)
    );
    this.disciplineEducationalComplexClient = new DisciplineEducationalComplexClient(
      (payload) => cache.getDisciplineEducationalComplex(payload.data),
      (payload) => httpClient.getDisciplineEducationalComplex(payload.data),
      parseDisciplineEducationalComplex,
      (data, payload) => cache.placeDisciplineEducationalComplex(payload.data, data)
    );
    this.disciplineEducationalComplexThemeClient = new DisciplineEducationalComplexThemeClient(
      (payload) => cache.getDisciplineEducationalComplexTheme(payload.data),
      (payload) => httpClient.getDisciplineEducationalComplexTheme(payload.data),
      parseDisciplineEducationalComplexTheme,
      (data, payload) => cache.placeDisciplineEducationalComplexTheme(payload.data, data)
    );
    this.examQuestionsClient = new ExamQuestionsClient(
      emptyFunction,
      (payload) => httpClient.getExamQuestions(payload.data),
      parseExamQuestions,
      emptyFunction
    );

    bind(this, Client);
  }

  async getAbsencesData(payload: IGetPayload<number>): Promise<IGetResult<IAbsence>> {
    await cache.absences.init();
    return this.absencesClient.getData(payload);
  }

  async getAnnounceData(payload: IGetPayload): Promise<IGetResult<IAnnounce[]>> {
    await cache.announce.init();
    return this.announceClient.getData(payload);
  }

  async getTimeTableData(payload: IGetPayload<number>): Promise<IGetResult<ITimeTable>> {
    await cache.timeTable.init();
    return this.timeTableClient.getData(payload);
  }

  async getMessagesData(payload: IGetPayload<number>): Promise<IGetResult<IMessagesData>> {
    await cache.messages.init();
    return this.messageClient.getData(payload);
  }

  async getOrdersData(payload: IGetPayload): Promise<IGetResult<IOrder[]>> {
    await cache.orders.list.init();
    return this.orderClient.getData(payload);
  }

  async getRatingData(payload: IGetPayload<number>): Promise<IGetResult<ISessionRating>> {
    await cache.signsRating.init();
    return this.ratingClient.getData(payload);
  }

  async getSessionSignsData(payload: IGetPayload<number>): Promise<IGetResult<ISessionPoints>> {
    await cache.signsPoints.init();
    return this.signsClient.getData(payload);
  }

  async getPointUpdates(payload: IGetPayload<string>): Promise<IGetResult<IPointUpdates>> {
    return this.pointUpdatesClient.getData(payload);
  }

  async getSessionMarksData(payload: IGetPayload): Promise<IGetResult<ISessionMarks[]>> {
    await cache.signsMarks.init();
    return this.marksClient.getData(payload);
  }

  async getStudentInfoData(payload: IGetPayload): Promise<IGetResult<StudentInfo>> {
    await cache.student.init();
    return this.studentClient.getData(payload);
  }

  async getTeacherData(payload: IGetPayload): Promise<IGetResult<ITeacher[]>> {
    await cache.teachers.init();
    return this.teacherClient.getData(payload);
  }

  async getTeachPlanData(payload: IGetPayload): Promise<IGetResult<ISessionTeachPlan[]>> {
    await cache.teachPlan.init();
    return this.teachPlanClient.getData(payload);
  }

  async getCalendarScheduleData(payload: IGetPayload): Promise<IGetResult<ICalendarSchedule>> {
    await cache.calendarSchedule.init();
    return this.calendarScheduleClient.getData(payload);
  }

  async getCertificateData(payload: IGetPayload): Promise<IGetResult<ICertificateResult>> {
    await cache.certificate.init();
    return this.certificateClient.getData(payload);
  }

  async getSessionQuestionnaireList(
    payload: IGetPayload<string>
  ): Promise<IGetResult<ISessionQuestionnaireLink[]>> {
    return this.sessionQuestionnaireListClient.getData(payload);
  }

  async getSessionQuestionnaire(
    payload: IGetPayload<string>
  ): Promise<IGetResult<ISessionQuestionnaire>> {
    return this.sessionQuestionnaireClient.getData(payload);
  }

  async getPersonalRecords(payload: IGetPayload): Promise<IGetResult<IPersonalRecord[]>> {
    return this.personalRecordsClient.getData(payload);
  }

  getCathedraTimetable(
    payload: IGetPayload<ICathedraTimetablePayload>
  ): Promise<IGetResult<ICathedraTimetable>> {
    return this.cathedraTimetableClient.getData(payload);
  }

  getGroupTimetable(payload: IGetPayload<IGroupTimetablePayload>): Promise<IGetResult<ITimeTable>> {
    return this.groupTimetableClient.getData(payload);
  }

  getDisciplineEducationalComplex(
    payload: IGetPayload<IDisciplineEducationalComplexPayload>
  ): Promise<IGetResult<IDisciplineEducationalComplex>> {
    return this.disciplineEducationalComplexClient.getData(payload);
  }

  getDisciplineEducationalComplexTheme(
    payload: IGetPayload<IDisciplineEducationalComplexThemePayload>
  ): Promise<IGetResult<IDisciplineEducationalComplexTheme>> {
    return this.disciplineEducationalComplexThemeClient.getData(payload);
  }

  getExamQuestions(payload: IGetPayload<string>) {
    return this.examQuestionsClient.getData(payload);
  }
}
