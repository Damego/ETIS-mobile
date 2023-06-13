import axios from 'axios';
import * as cheerio from 'cheerio';
import { documentDirectory, downloadAsync } from 'expo-file-system';
import { toURLSearchParams } from './encoding';

class HTTPClient {
  constructor() {
    this.defaultURL = 'https://student.psu.ru/pls/stu_cus_et';
    this.sessionID = null;
  }

  async request(endpoint, params = null) {
    if (this.sessionID == null) {
      return;
    }

    const url = `${this.defaultURL}${endpoint}`;

    console.log(`[HTTP] Sending request to '${url}' with params:`, params);

    try {
      const response = await axios.get(url, {
        headers: {
          Cookie: this.sessionID,
        },
        params,
      });
      return response.data;
    } catch (e) {
      console.warn('[HTTP]', e);
      return null;
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
  async login(username, password, token) {
    const formData = new FormData();
    formData.append('p_redirect', '/stu.timetable');
    formData.append('p_username', username.trim());
    formData.append('p_password', password.trim());
    formData.append('p_recaptcha_ver', '3');
    formData.append('p_recaptcha_response', token.trim());

    console.log(`[HTTP] Authorizing with data ${JSON.stringify(formData)}`);

    let response;
    try {
      response = await axios.post(`${this.defaultURL}/stu.login`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (e) {
      return {
        errorMessage: 'Ошибка соединения. \nПопробуйте зайти позже',
      };
    }

    const cookies = response.headers['set-cookie'];

    if (!cookies) {
      const $ = cheerio.load(response.data);
      let errorMessage = $('.error_message').text();
      if (!errorMessage) errorMessage = 'Ошибка авторизации. Попробуйте ещё раз.';
      return { sessionID: null, errorMessage };
    }

    const [sessionID] = cookies[0].split(';');
    this.sessionID = sessionID;

    console.log(`[HTTP] Authorized with ${sessionID}`);

    return { sessionID, errorMessage: null };
  }

  async sendRecoveryMail(username, token) {
    const formData = new FormData();
    formData.append('p_step', '1');
    formData.append('p_email', username.trim());
    formData.append('p_recaptcha_response', token.trim());

    console.log(`[HTTP] Recovering with data ${JSON.stringify(formData)}`);

    let response;
    try {
      response = await axios.post(`${this.defaultURL}/stu_email_pkg.send_r_email`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (e) {
      return {
        errorMessage: 'Ошибка соединения. \nПопробуйте зайти позже',
      };
    }

    const $ = cheerio.load(response.data);
    if ($('#sbmt > span').text() === 'Получить письмо') {
      let errorMessage = $('.error_message').text();
      return { errorMessage };
    }

    return { errorMessage: null };
  }

  getTimeTable({ showConsultations = null, week = null } = {}) {
    /*
    `showConsultations`:
    - y: Показывать консультации
    - n: Скрывать консультации

    `week`: неделя в триместре.
    */
    const showConsultationsParam = showConsultations ? 'y' : 'n';

    return this.request('/stu.timetable', {
      p_cons: showConsultationsParam,
      p_week: week,
    });
  }

  getEblChoice() {
    return this.request('/stu.ebl_choice');
  }

  getTeachPlan() {
    return this.request('/stu.teach_plan');
  }

  getSigns(mode, trimester) {
    /*
    `mode`:
    - session: оценки за сессии
    - current: оценки в триместре
    - rating: итоговый рейтинг за триместр 
    - diplom: оценки в диплом
    */

    const params = { p_mode: mode };

    if (trimester !== undefined) {
      params.p_term = trimester;
    }

    return this.request('/stu.signs', params);
  }

  getAbsences(trimester) {
    /*
    `trimester`:
      - 1: осенний
      - 2: весенний
      - 3: летний
     */
    return this.request('/stu.absence', { p_term: trimester });
  }

  getTeachers() {
    return this.request('/stu.teachers');
  }

  getAnnounce() {
    return this.request('/stu.announce');
  }

  getMessages(page) {
    let payload;
    if (page !== undefined) {
      payload = { p_page: page };
    }
    return this.request('/stu.teacher_notes', payload);
  }

  async replyToMessage(answerID, content) {
    // stu.send_reply p_anv_id: 1863863 p_msg_txt
    // stu.repl_doc_write file: (binary) p_ant_id: 73510 p_anr_id: 47734

    const data = {
      p_anv_id: answerID,
      p_msg_txt: content,
    };

    const encoded = toURLSearchParams(data);

    const url = `${this.defaultURL}/stu.send_reply`;
    console.log(`[HTTP] [POST] ${url} data: ${encoded}`);
    await axios.post(url, encoded);
  }

  async attachFileToMessage(messageID, answerMessageID, file) {
    const data = new FormData();
    data.append('p_ant_id', messageID);
    data.append('p_anr_id', answerMessageID);

    data.append('file', { name: file.name, uri: file.uri, type: file.type });
    await axios.post(`${this.defaultURL}/stu.repl_doc_write`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  getBlankPage() {
    return this.request('/stu.blank_page');
  }

  getGroupJournal() {
    return this.request('/stu_jour.group_tt');
  }

  getOrders() {
    return this.request('/stu.orders');
  }

  getCertificate() {
    return this.request('/cert_pkg.stu_certif');
  }
}

const httpClient = new HTTPClient();
export default httpClient;