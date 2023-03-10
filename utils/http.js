import axios from "axios";

export default class HTTPClient {
  constructor() {
    this.defaultURL = "https://student.psu.ru/pls/stu_cus_et/stu";
    this.sessionID = null;
  }

  async request(endpoint, params = null) {
    if (this.sessionID == null) {
      return;
    }

    let url = `${this.defaultURL}.${endpoint}`;

    console.log(`[HTTP] Sending request to '${url}' with params:`, params);

    let response = await axios.get(url, {
      headers: {
        Cookie: this.sessionID,
      },
      params,
    });

    if (this.checkForError(response)) return null;

    return response.data;
  }

  checkForError(response) {
    if (response.headers["content-length"] === "20020") {
      console.warn("You have been ratelimited (5 requests per 10 minutes).");
      return true;
    } else if (response.headers["content-length"] === "20073") {
      console.warn(
        "You passed wrong login or password, or ReCaptcha token is outdated."
      );
      return true;
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
    console.log("login method");
    if (!token) {
      return console.warn("No token was passed!");
    }
    let formData = new FormData();

    formData.append("p_redirect", "stu.timetable");
    formData.append("p_username", username.trim());
    formData.append("p_password", password.trim());
    formData.append("p_recaptcha_ver", "3");
    formData.append("p_recaptcha_response", token.trim());

    let response = await axios.post(`${this.defaultURL}.login`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    let cookies = response.headers["set-cookie"];
    console.log(response.headers);

    // Figuring out error via content length
    if (!cookies) {
      if (!this.checkForError(response)) {
        console.warn(
          "Unknown error. Content length:",
          response.headers["content-length"]
        );
      }
      return;
    }

    this.sessionID = cookies[0].split(";")[0];
    console.log(`Authorized with ${this.sessionID}`);

    return this.sessionID;
  }

  async getTimeTable({ showConsultations = null, week = null } = {}) {
    /*
    `showConsultations`:
    - y: Показывать консультации
    - n: Скрывать консультации

    `week`: неделя в триместре.
    */
    let _showConsultations = !!showConsultations ? "y" : "n";
    return await this.request("timetable", {
      p_cons: _showConsultations,
      p_week: week,
    });
  }

  async getEblChoice() {
    return await this.request("ebl_choice");
  }

  async getTeachPlan() {
    return await this.request("teach_plan");
  }

  async getSigns(mode) {
    /*
    `mode`:
    - session: оценки за сессии
    - current: оценки в триместре
    - rating: итоговый рейтинг за триместр 
    - diplom: оценки в диплом
    */
    return await this.request("signs", { p_mode: mode });
  }

  async getAbsenses(trimester) {
    /*
    `trimester`:
      - 1: осенний
      - 2: весенний
      - 3: летний
     */
    return await this.request("absence", { p_term: trimester });
  }

  async getTeachers() {
    return await this.request("teachers");
  }

  async getAnnounce() {
    return await this.request("announce");
  }

  async getTeacherNotes() {
    return await this.request("teacher_notes");
  }
}
