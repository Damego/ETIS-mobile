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

    return response.data;
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
    formData.append('p_redirect', 'stu.timetable');
    formData.append('p_username', username.trim());
    formData.append('p_password', password.trim());
    formData.append('p_recaptcha_ver', '3');
    formData.append('p_recaptcha_response', token.trim());

    console.log(`[HTTP] Authorizing with data ${formData}`);

    const response = await axios.post(`${this.defaultURL}.login`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

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

  getSigns(mode, { trimester }) {
    /*
    `mode`:
    - session: оценки за сессии
    - current: оценки в триместре
    - rating: итоговый рейтинг за триместр 
    - diplom: оценки в диплом
    */

    const params = { p_mode: mode };

    if (trimester !== undefined) {
      params.p_term = trimester
    }

    return this.request('signs', params);
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
