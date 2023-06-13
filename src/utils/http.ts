import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { documentDirectory, downloadAsync } from 'expo-file-system';

import { toURLSearchParams } from './encoding';
import { getNetworkStateAsync } from 'expo-network';

export enum ErrorCode {
  unknown,
  invalidConnection,
  authError
}

export interface HTTPError {
  error: {
    code: ErrorCode;
    message: string;
  }
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
    endpoint: string,
    method: string,
    { params, data, returnResponse }: { params?: any; data?: any; returnResponse?: boolean } = {}
  ): Promise<AxiosResponse | HTTPError | any> {
    console.log(
      `[HTTP] [${method}] Sending request to '${endpoint}' with params: ${JSON.stringify(params)}; data: ${JSON.stringify(
        data
      )}`
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

    const response = await this.request(`/stu.login`, 'POST', {
      data,
      returnResponse: true,
    });

    if (response.error) return null;

    const cookies = response.headers['set-cookie'];

    if (!cookies) {
      const $ = cheerio.load(response.data);
      const errorMessage = $('.error_message').text();
      if (!errorMessage)
        return { error: { code: ErrorCode.authError, message: 'Ошибка авторизации. Попробуйте ещё раз.' } };
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

    const response = await this.request('/stu_email_pkg.send_r_email', 'POST', { data });

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

    return this.request('/stu.timetable', 'GET', {
      params: { p_cons: showConsultationsParam, p_week: week },
    });
  }

  getTeachPlan() {
    return this.request('/stu.teach_plan', 'GET');
  }

  /*
    `mode`:
    - session: оценки за сессии
    - current: оценки в триместре
    - rating: итоговый рейтинг за триместр 
    - diplom: оценки в диплом
    */
  getSigns(mode, trimester) {
    const params = { p_mode: mode, p_term: undefined };

    if (trimester !== undefined) {
      params.p_term = trimester;
    }

    return this.request('/stu.signs', 'GET', { params });
  }

  /*
  `trimester`:
    - 1: осенний
    - 2: весенний
    - 3: летний
   */
  getAbsences(trimester) {
    return this.request('/stu.absence', 'GET', { params: { p_term: trimester } });
  }

  getTeachers() {
    return this.request('/stu.teachers', 'GET');
  }

  getAnnounce() {
    return this.request('/stu.announce', 'GET');
  }

  getMessages(page) {
    let payload;
    if (page !== undefined) {
      payload = { p_page: page };
    }
    return this.request('/stu.teacher_notes', payload);
  }

  async replyToMessage(answerID, content) {
    const rawData = {
      p_anv_id: answerID,
      p_msg_txt: content,
    };
    const data = toURLSearchParams(rawData);
    return await this.request('/stu.send_reply', 'GET', { data });
  }

  async attachFileToMessage(messageID, answerMessageID, file) {
    const data = new FormData();
    data.append('p_ant_id', messageID);
    data.append('p_anr_id', answerMessageID);
    data.append('file', { name: file.name, uri: file.uri, type: file.type });

    return await this.request('/stu.repl_doc_write', 'POST', { data });
  }

  getBlankPage() {
    return this.request('/stu.blank_page', 'GET');
  }

  getGroupJournal() {
    return this.request('/stu_jour.group_tt', 'GET');
  }

  getOrders() {
    return this.request('/stu.orders', 'GET');
  }

  getCertificate() {
    return this.request('/cert_pkg.stu_certif', 'GET');
  }
}

const httpClient = new HTTPClient();
export default httpClient;
