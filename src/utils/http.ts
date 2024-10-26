import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { documentDirectory, downloadAsync } from 'expo-file-system';
import { getNetworkStateAsync } from 'expo-network';
import { ICathedraTimetablePayload } from '~/models/cathedraTimetable';
import { ICertificate } from '~/models/certificate';
import { UploadFile } from '~/models/other';

import { CertificateRequestPayload } from './certificate';
import { PSU_URL } from './consts';
import { getCurrentEducationYear } from './datetime';
import { toURLSearchParams } from './encoding';
import { SessionQuestionnairePayload } from './sessionTest';
import getRandomUserAgent from './userAgents';

const cyrillicToTranslit = CyrillicToTranslit();

export enum ErrorCode {
  unknown,
  invalidConnection,
  authError,
}

export interface HTTPError {
  code: ErrorCode;
  message: string;
}

interface Payload {
  params?: unknown;
  data?: unknown;
  returnResponse?: boolean;
}
interface PayloadWithResponse {
  params?: unknown;
  data?: unknown;
  returnResponse: true;
}
interface PayloadWithString {
  params?: unknown;
  data?: unknown;
  returnResponse?: false;
}

export interface Response<T> {
  data?: T;
  error?: HTTPError;
}

const PROXY_SERVER_URL = 'https://etisproxy0.damego.ru/student';

class HTTPClient {
  private sessionID: string | null;
  private instance: AxiosInstance;
  private readonly siteSuffix: string = '/pls/stu_cus_et';
  private readonly siteURL: string = 'https://student.psu.ru';
  private readonly baseURL: string;
  private useProxy: boolean;

  constructor() {
    this.sessionID = null;
    this.baseURL = `${this.siteURL}${this.siteSuffix}`;
    this.createAxiosInstance();
  }

  private createAxiosInstance() {
    this.instance = axios.create({
      baseURL: this.useProxy ? `${PROXY_SERVER_URL}${this.siteSuffix}` : this.baseURL,
      headers: {
        'User-Agent': getRandomUserAgent(),
      },
    });
  }

  getSiteURL() {
    return this.useProxy ? PROXY_SERVER_URL : this.siteURL;
  }

  getSessionID() {
    return this.sessionID;
  }

  async isInternetReachable() {
    try {
      const networkState = await getNetworkStateAsync();
      return networkState.isInternetReachable;
    } catch (e) {
      console.warn('[HTTP] Cannot get network state');
      return true;
    }
  }

  private async detectNetworkIssue(error: AxiosError) {
    return (
      error.message === 'Network Error' &&
      error.code === 'ERR_NETWORK' &&
      (await this.isInternetReachable())
    );
  }

  async request(
    method: string,
    endpoint: string,
    { params, data, returnResponse }: PayloadWithResponse
  ): Promise<Response<AxiosResponse>>;

  async request(
    method: string,
    endpoint: string,
    { params, data, returnResponse }: PayloadWithString
  ): Promise<Response<string>>;

  async request(method: string, endpoint: string): Promise<Response<string>>;

  async request(
    method: string,
    endpoint: string,
    { params, data, returnResponse }: Payload = { returnResponse: false }
  ): Promise<Response<string | AxiosResponse>> {
    console.log(
      `[HTTP] [${method}] Sending request to '${endpoint}' with params: ${JSON.stringify(
        params
      )}; data: ${JSON.stringify(data)}`
    );

    if (!(await this.isInternetReachable())) {
      console.warn('[HTTP] Internet is not reachable. Cancelling current request');
      return {
        error: {
          code: ErrorCode.invalidConnection,
          message: 'Нет подключения к интернету!',
        },
      };
    }

    const headers = {
      Cookie: this.sessionID,
    };

    let $data;
    if (data) {
      if (data instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
        $data = data;
      } else {
        $data = toURLSearchParams(data);
      }
    }

    try {
      const response = await this.instance.request({
        url: endpoint,
        method,
        headers,
        params,
        data: $data,
      });
      return {
        data: returnResponse ? response : response.data,
      };
    } catch (e) {
      console.warn('[HTTP]', e);

      // https://github.com/Damego/ETIS-mobile/issues/168
      if (!this.useProxy && (await this.detectNetworkIssue(e))) {
        console.warn('[HTTP] Detected network issue. Switching to proxy server.');
        this.useProxy = true;
        this.createAxiosInstance();
        return await this.request(method, endpoint, { params, data, returnResponse });
      }

      return {
        error: {
          code: ErrorCode.invalidConnection,
          message: 'Нет соединения с ЕТИС. Попробуйте зайти позже',
        },
      };
    }
  }

  downloadFile(uri: string, fileName: string) {
    const url = `${this.baseURL}/${uri}`;

    console.log(`[HTTP] Downloading a file from ${url}`);

    return downloadAsync(url, `${documentDirectory}${fileName}`, {
      headers: {
        Cookie: this.sessionID,
      },
    });
  }

  /**
   *
   * @param {string} username Электронная почта
   * @param {string} password Пароль
   * @param {string} token Токен ReCaptcha
   * @param {boolean} isInvisibleRecaptcha Является ли рекапча невидимой
   * @returns
   */
  async login(
    username: string,
    password: string,
    token: string,
    isInvisibleRecaptcha: boolean
  ): Promise<Response<AxiosResponse | null>> {
    const data = {
      p_redirect: '/stu.blank_page',
      p_username: username.trim(),
      p_password: password.trim(),
      p_recaptcha_ver: isInvisibleRecaptcha ? '3' : '2',
      p_recaptcha_response: token,
    };
    const response = await this.request('POST', `/stu.login`, {
      data,
      returnResponse: true,
    });

    if (response.error) return response;

    const cookies = response.data.headers['set-cookie'];

    if (!cookies) {
      const $ = cheerio.load(response.data.data);
      const errorMessage = $('.error_message').text();
      if (!errorMessage)
        return {
          error: { code: ErrorCode.authError, message: 'Ошибка авторизации. Попробуйте ещё раз.' },
        };
      return { error: { code: ErrorCode.unknown, message: errorMessage } };
    }

    const [sessionID] = cookies[0].split(';');
    this.sessionID = sessionID;

    console.log(`[HTTP] Authorized with ${sessionID}`);

    return null;
  }

  async sendRecoveryMail(email: string, token: string): Promise<Response<null>> {
    const data = new FormData();
    data.append('p_step', '1');
    data.append('p_email', email.trim());
    data.append('p_recaptcha_response', token.trim());

    const response = await this.request('POST', '/stu_email_pkg.send_r_email', {
      data,
    });

    if (response.error) return null;

    const $ = cheerio.load(response.data);
    if ($('#sbmt > span').text() === 'Получить письмо') {
      return {
        error: {
          code: ErrorCode.unknown,
          message: $('.error_message').text(),
        },
      };
    }

    return null;
  }

  getPointUpdates(url: string): Promise<Response<string>> {
    return this.request('GET', url, {
      params: {},
      returnResponse: false,
    });
  }

  /*
    `showConsultations`:
    - y: Показывать консультации
    - n: Скрывать консультации

    `week`: неделя в триместре.
   */
  getTimeTable({ showConsultations = null, week = null } = {}) {
    const showConsultationsParam = showConsultations ? 'y' : 'n';

    return this.request('GET', '/stu.timetable', {
      params: { p_cons: showConsultationsParam, p_week: week },
    });
  }

  getTeachPlan(mode?: string) {
    return this.request('GET', '/stu.teach_plan', {
      params: { p_mode: mode },
    });
  }

  /*
    `mode`:
    - session: оценки за сессии
    - current: оценки в триместре
    - rating: итоговый рейтинг за триместр
    - diplom: оценки в диплом
    */
  getSigns(mode: string, trimester?: number) {
    const params = { p_mode: mode, p_term: undefined };

    if (trimester !== undefined) {
      params.p_term = trimester;
    }

    return this.request('GET', '/stu.signs', { params });
  }

  /*
  `session`:
    - 1: осенний
    - 2: весенний
    - 3: летний (если студент учится по триместрам)
   */
  getAbsences(session?: number) {
    const params: { p_term?: number } = {};

    if (session) {
      params.p_term = session;
    }

    return this.request('GET', '/stu.absence', { params });
  }

  getTeachers() {
    return this.request('GET', '/stu.teachers');
  }

  getAnnounce() {
    return this.request('GET', '/stu.announce');
  }

  getMessages(page: number) {
    let params;
    if (page !== undefined) {
      params = { p_page: page };
    }
    return this.request('GET', '/stu.teacher_notes', { params });
  }

  replyToMessage(answerID: string, content: string) {
    const data = {
      p_anv_id: answerID,
      p_msg_txt: content,
    };
    return this.request('POST', '/stu.send_reply', { data });
  }

  attachFileToMessage(messageID: string, answerMessageID: string, file: UploadFile) {
    file.name = cyrillicToTranslit.transform(file.name);

    const data = new FormData();
    data.append('p_ant_id', messageID);
    data.append('p_anr_id', answerMessageID);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.append('file', file);

    return this.request('POST', '/stu.repl_doc_write', { data });
  }

  getBlankPage() {
    return this.request('GET', '/stu.blank_page');
  }

  getGroupJournal() {
    return this.request('GET', '/stu_jour.group_tt');
  }

  getOrders() {
    return this.request('GET', '/stu.orders');
  }

  getCertificate() {
    return this.request('GET', '/cert_pkg.stu_certif');
  }

  getSessionQuestionnaireList(id: string | number) {
    return this.request('GET', '/stu.term_test', {
      params: { p_toes_id: id },
    });
  }

  getSessionQuestionnaire(url: string) {
    return this.request('GET', url);
  }

  async sendSessionQuestionnaireResult(payload: SessionQuestionnairePayload) {
    return this.request('POST', '/stu.term_test_save', { data: payload });
  }

  async sendCertificateRequest(payload: CertificateRequestPayload) {
    return this.request('POST', '/cert_pkg.stu_certif', { data: payload });
  }

  async getCertificateHTML(certificate: ICertificate) {
    const params = {
      p_creq_id: certificate.id,
      p_action: 'VIEW',
    };
    return this.request('GET', `/cert_pkg.stu_certif`, { params });
  }

  getPersonalRecords() {
    return this.request('GET', '/stu.change_pr_page');
  }

  async changePersonalRecord(id: string) {
    const params = {
      p_pr_id: id,
    };
    const response = await this.request('GET', '/stu.change_pr', { params, returnResponse: true });
    return response.data.status === 200;
  }

  changePassword(oldPassword: string, newPassword: string) {
    const data = {
      p_old: oldPassword,
      p_new: newPassword,
      p_new_confirm: newPassword,
    };

    return this.request('POST', '/stu.change_pass', { data });
  }

  changeEmail(email: string) {
    const data = {
      p_step: 1,
      p_email: email,
    };

    return this.request('POST', '/stu_email_pkg.change_email', { data });
  }

  sendVerificationMail() {
    const data = {
      p_step: 1,
    };
    return this.request('POST', '/stu_email_pkg.send_v_email', { data });
  }

  getCathedraTimetable({ session, week, teacherId, cathedraId }: ICathedraTimetablePayload) {
    const params = {
      // Пустая строка необходима для правильного отображения недельного расписания
      // Хотя странно, а зачем? Ну да ладно, это проблема ЕТИСа.
      // Гарантируется, что в один момент может быть либо session, либо week
      p_term: week !== undefined ? '' : session,
      p_week: week,
      p_sdiv_id: cathedraId,
      p_peo_id: teacherId,
      p_ty_id: getCurrentEducationYear(),
    };

    return this.request('GET', '/tt_pkg.show_prep', { params });
  }

  getGroupTimetable({
    groupId,
    facultyId,
    course,
    period,
    year,
    week,
  }: {
    groupId: string;
    facultyId: string;
    course: number;
    period: number;
    year: number;
    week: number;
  }) {
    const params = {
      // Непонятная фигня, которая остаётся постоянной для всех групп
      P_FOE_ID: '1',
      P_TEDP_ID: '1',
      P_LANG: 'N',
      P_JOU: 'N',

      P_DIV_ID: facultyId,
      P_COURSE: course,
      P_TERM: period,
      P_TY_ID: year,
      P_NG_ID: groupId,
      P_TW: week,
    };

    return this.request('GET', '/tt_pkg.tt_show_for_stu', { params });
  }

  /*
  Возвращает ссылку на результат поиска по запросу на сайте ПГНИУ
  */
  getSearchPageURL(query: string) {
    const url = new URL(`${PSU_URL}/poisk`);
    url.searchParams.append('searchword', query);
    url.searchParams.append('ordering', 'popular');
    url.searchParams.append('searchphrase', 'exact');
    url.searchParams.append('limit', '10');

    return url.toString();
  }
}

const httpClient = new HTTPClient();
export default httpClient;
