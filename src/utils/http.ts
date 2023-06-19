import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { documentDirectory, downloadAsync } from 'expo-file-system';
import { getNetworkStateAsync } from 'expo-network';

import { UploadFile } from '../models/other';
import { toURLSearchParams } from './encoding';

export enum ErrorCode {
  unknown,
  invalidConnection,
  authError,
}

export interface HTTPError {
  error: {
    code: ErrorCode;
    message: string;
  };
}

interface Payload {
  params?: any;
  data?: any;
  returnResponse?: boolean;
}
interface PayloadWithResponse {
  params?: any;
  data?: any;
  returnResponse?: true;
}
interface PayloadWithString {
  params?: any;
  data?: any;
  returnResponse?: false;
}

class HTTPClient {
  private sessionID: string | null;
  private instance: AxiosInstance;
  private readonly defaultURL: string;

  constructor() {
    this.sessionID = null;
    this.defaultURL = 'https://student.psu.ru/pls/stu_cus_et';
    this.instance = axios.create({
      baseURL: this.defaultURL,
    });
  }

  async request(
    method: string,
    endpoint: string,
    { params, data, returnResponse }?: PayloadWithResponse
  ): Promise<AxiosResponse | HTTPError>;

  async request(
    method: string,
    endpoint: string,
    { params, data, returnResponse }?: PayloadWithString
  ): Promise<string | HTTPError>;

  async request(
    method: string,
    endpoint: string,
    { params, data, returnResponse }: Payload = { returnResponse: false }
  ): Promise<AxiosResponse | HTTPError | string> {
    console.log(
      `[HTTP] [${method}] Sending request to '${endpoint}' with params: ${JSON.stringify(
        params
      )}; data: ${JSON.stringify(data)}`
    );

    const networkState = await getNetworkStateAsync();
    if (!networkState.isInternetReachable) {
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

    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    try {
      const response = await this.instance.request({
        url: endpoint,
        method,
        headers,
        params,
        data,
      });
      return returnResponse ? response : response.data;
    } catch (e) {
      console.warn('[HTTP]', e);
      return {
        error: {
          code: ErrorCode.invalidConnection,
          message: 'Нет соединения с ЕТИС. Попробуйте зайти позже',
        },
      };
    }
  }

  downloadFile(uri, fileName) {
    const url = `${this.defaultURL}/${uri}`;

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
   * @param {string} token Токен ReCaptcha v3
   * @returns
   */
  async login(username: string, password: string, token: string): Promise<HTTPError | null> {
    const data = new FormData();
    data.append('p_redirect', '/stu.timetable');
    data.append('p_username', username.trim());
    data.append('p_password', password.trim());
    data.append('p_recaptcha_ver', '3');
    data.append('p_recaptcha_response', token.trim());

    const response = await this.request('POST', `/stu.login`, {
      data,
      returnResponse: true,
    });

    if ((response as HTTPError).error) return response;

    const cookies = (response as AxiosResponse).headers['set-cookie'];

    if (!cookies) {
      const $ = cheerio.load((response as AxiosResponse).data);
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
  }

  async sendRecoveryMail(email: string, token: string) {
    const data = new FormData();
    data.append('p_step', '1');
    data.append('p_email', email.trim());
    data.append('p_recaptcha_response', token.trim());

    const response = await this.request('POST', '/stu_email_pkg.send_r_email', {
      data,
      returnResponse: false,
    });

    if (response.error) return null;

    const $ = cheerio.load(response);
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
      returnResponse: false,
    });
  }

  getTeachPlan() {
    return this.request('GET', '/stu.teach_plan', { returnResponse: false });
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

    return this.request('GET', '/stu.signs', { params, returnResponse: false });
  }

  /*
  `trimester`:
    - 1: осенний
    - 2: весенний
    - 3: летний
   */
  getAbsences(trimester: number) {
    return this.request('GET', '/stu.absence', {
      params: { p_term: trimester },
      returnResponse: false,
    });
  }

  getTeachers() {
    return this.request('GET', '/stu.teachers', { returnResponse: false });
  }

  getAnnounce() {
    return this.request('GET', '/stu.announce', { returnResponse: false });
  }

  getMessages(page: number) {
    let params;
    if (page !== undefined) {
      params = { p_page: page };
    }
    return this.request('GET', '/stu.teacher_notes', { params, returnResponse: false });
  }

  async replyToMessage(answerID: string, content: string) {
    const rawData = {
      p_anv_id: answerID,
      p_msg_txt: content,
    };
    const data = toURLSearchParams(rawData);
    return await this.request('POST', '/stu.send_reply', { data, returnResponse: false });
  }

  async attachFileToMessage(messageID: string, answerMessageID: string, file: UploadFile) {
    const data = new FormData();
    data.append('p_ant_id', messageID);
    data.append('p_anr_id', answerMessageID);
    data.append('file', file);

    return await this.request('POST', '/stu.repl_doc_write', { data, returnResponse: false });
  }

  getBlankPage() {
    return this.request('GET', '/stu.blank_page', { returnResponse: false });
  }

  getGroupJournal() {
    return this.request('GET', '/stu_jour.group_tt', { returnResponse: false });
  }

  getOrders() {
    return this.request('GET', '/stu.orders', { returnResponse: false });
  }

  getCertificate() {
    return this.request('GET', '/cert_pkg.stu_certif', { returnResponse: false });
  }
}

const httpClient = new HTTPClient();
export default httpClient;
