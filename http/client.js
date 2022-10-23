import axios from "axios";

export default class HTTPClient {
  constructor() {
    this.defaultURL = "https://student.psu.ru/pls/stu_cus_et/stu";
    this.sessionID = null;
  }

  async login(username, password, token) {
    let formData = new FormData();

    formData.append("p_redirect", "stu.timetable");
    formData.append("p_username", username);
    formData.append("p_password", password);
    formData.append("p_recaptcha_ver", "3");
    formData.append("p_recaptcha_response", token);

    let response = await axios.post(`${this.defaultURL}.login`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    var cookies = response.headers["set-cookie"];
    if (cookies != undefined) {
      // TODO: return exception message?
      this.sessionID = cookies[0].split(";")[0];
      console.log(`Authorized with ${this.sessionID}`);
    }
  }

  async getTimeTable() {
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.timetable`, {
      headers: {
        Cookie: this.sessionID,
      },
    });
    return response.data;
  }

  async getEblChoice() { // lol
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

  async getSigns() {
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.signs`, {
      headers: {
        Cookie: this.sessionID,
      },
    });
    return response.data;
  }

  async getAbsenses() {
    if (this.sessionID == null) {
      return; // TODO: Exceptions? Output error message? Auto authorize?
    }

    let response = await axios.get(`${this.defaultURL}.absence`, {
      headers: {
        Cookie: this.sessionID,
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
}
