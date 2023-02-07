import axios from "axios";

export default class HTTPClient {
  constructor() {
    this.defaultURL = "https://student.psu.ru/pls/stu_cus_et/stu";
    this.sessionID = null;
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

    // Figuring out error via content lenght
    if (!cookies) {
      if (response.headers["content-length"] == "20020") {
        console.warn("You have been ratelimited (5 requests per 10 minutes).")
      }
      else if (response.headers["content-length"] == "20073") {
        console.warn(
          "You passed wrong login or password, or ReCaptcha token is outdated."
        );
      }
      else {
        console.warn("Unknown error. Content lenght:", response.headers["content-length"]);
      }
      
      return;
    }

    this.sessionID = cookies[0].split(";")[0];
    console.log(`Authorized with ${this.sessionID}`);

    return this.sessionID;
  }

  async getTimeTable({showConsultations = null, week = null} = {}) {
    /*
    `showConsultations`:
    - y: Показывать консультации
    - n: Скрывать консультации

    `week`: неделя в триместре.
    */
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let _showConsultations = !!showConsultations ? "y" : "n";
    let response = await axios.get(`${this.defaultURL}.timetable`, {
      headers: {
        Cookie: this.sessionID,
      },
      params: {
        p_cons: _showConsultations,
        p_week: week,
      },
    });
    return response.data;
  }

  async getEblChoice() {
    // lol
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.ebl_choice`, {
      headers: {
        Cookie: this.sessionID,
      },
    });
    return response.data;
  }

  async getTeachPlan() {
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.teach_plan`, {
      headers: {
        Cookie: this.sessionID,
      },
    });
    return response.data;
  }

  async getSigns(mode) {
    /*
    `mode`:
    - session: оценки за сессии
    - current: оценки в триместре
    - rating: итоговый рейтинг за триместр 
    - diplom: оценки в диплом
    */
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.signs`, {
      headers: {
        Cookie: this.sessionID,
      },
      params: {
        p_mode: mode,
      },
    });
    return response.data;
  }

  async getAbsenses(trimester) {
    /*
    `trimester`:
      - 1: осенний
      - 2: весенний
      - 3: летний
     */
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.absence`, {
      headers: {
        Cookie: this.sessionID,
      },
      params: {
        p_term: trimester,
      },
    });
    return response.data;
  }

  async getTeachers() {
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.teachers`, {
      headers: {
        Cookie: this.sessionID,
      },
    });
    return response.data;
  }

  async getAnnounce() {
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.announce`, {
      headers: {
        Cookie: this.sessionID,
      },
    });
    return response.data;
  }

  async getTeacherNotes() {
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.teacher_notes`, {
      headers: {
        Cookie: this.sessionID,
      },
    });
    return response.data;
  }
}
