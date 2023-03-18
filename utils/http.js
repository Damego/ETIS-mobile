import axios from 'axios';
import * as cheerio from 'cheerio';

export default class HTTPClient {
  constructor() {
    this.defaultURL = 'https://student.psu.ru/pls/stu_cus_et/stu';
    this.sessionID = null;
  }

  async request(endpoint, params = null) {
    if (this.sessionID == null) {
      return;
    }

    const url = `${this.defaultURL}.${endpoint}`;

    console.log(`[HTTP] Sending request to '${url}' with params:`, params);

    const response = await axios.get(url, {
      headers: {
        Cookie: this.sessionID,
      },
      params,
    });

    if (this.logError(response)) return null;

    return response.data;
  }

  logError(contentLength) {
    // 19961 - outdated token?
    // 19994 - ?
    // 19975 - ?
    if (contentLength === 20020) {
      console.warn('You have been ratelimited (5 requests per 10 minutes).');
      return true;
    }
    if (contentLength === 20073) {
      console.warn('You passed wrong login or password, or ReCaptcha token is outdated.');
      return true;
    }

    if (contentLength === 71) {
      console.warn('Neither login nor password were passed');
    }
    return false;
  }

  /**
   *
   * @param {string} username Электронная почта
   * @param {string} password Пароль
   * @param {string} token Токен ReCaptcha v3
   * @returns
   */
  async login(username, password, token) {
    if (!token) {
      return console.warn('No token was passed!');
    }
    const formData = new FormData();

    formData.append('p_redirect', 'stu.timetable');
    formData.append('p_username', username.trim());
    formData.append('p_password', password.trim());
    formData.append('p_recaptcha_ver', '3');
    formData.append('p_recaptcha_response', token.trim());

    console.log(formData);

    const response = await axios.post(`${this.defaultURL}.login`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const cookies = response.headers['set-cookie'];

    // Figuring out error via content length
    let contentLength = Number(response.headers['content-length']);
    if (!cookies) {
      if (contentLength > 10000) contentLength -= username.length + password.length;

      const $ = cheerio.load(response.data);
      const errorMessage = $('.error_message').text();

      if (!this.logError(contentLength)) {
        console.warn('Unknown error. Content length:', contentLength);
      }
      return { errorMessage };
    }

    const [sessionID] = cookies[0].split(';');
    this.sessionID = sessionID;

    console.log(`Authorized with ${sessionID}`);

    return { sessionID };
  }

  getTimeTable({ showConsultations = null, week = null } = {}) {
    /*
    `showConsultations`:
    - y: Показывать консультации
    - n: Скрывать консультации

    `week`: неделя в триместре.
    */
    const showConsultationsParam = showConsultations ? 'y' : 'n';

    return this.request('timetable', {
      p_cons: showConsultationsParam,
      p_week: week,
    });
  }

  getEblChoice() {
    return this.request('ebl_choice');
  }

  getTeachPlan() {
    return this.request('teach_plan');
  }

  getSigns(mode) {
    /*
    `mode`:
    - session: оценки за сессии
    - current: оценки в триместре
    - rating: итоговый рейтинг за триместр 
    - diplom: оценки в диплом
    */
    return this.request('signs', { p_mode: mode });
  }

  getAbsenses(trimester) {
    /*
    `trimester`:
      - 1: осенний
      - 2: весенний
      - 3: летний
     */
    return this.request('absence', { p_term: trimester });
  }

  getTeachers() {
    return this.request('teachers');
  }

  getAnnounce() {
    return this.request('announce');
  }

  getTeacherNotes() {
    return this.request('teacher_notes');
  }
}
