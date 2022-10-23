import axios from "axios";

export default class HTTPClient {
  constructor() {
    this.defaultURL = "https://student.psu.ru/pls/stu_cus_et/stu.";
    this.sessionID = null;
  }

  login(username, password, token) {
    var formData = new FormData();

    formData.append("p_redirect", "stu.timetable");
    formData.append("p_username", username);
    formData.append("p_password", password);
    formData.append("p_recaptcha_ver", "3");
    formData.append("p_recaptcha_response", token);

    axios
      .post(`${this.defaultURL}login`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.headers["set-cookie"] != undefined) {
          this.sessionID = response.headers["set-cookie"].split(";")[0];
        }
      });
  }
}
