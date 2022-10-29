import cheerio from "cheerio";

export default class DataParsing {
  parseHeader(html) {
    let data = {};
    const $ = cheerio.load(html);
    // Способы добавления элемента в словарь:   data['header'] = header  |  data.header = header;

    // ФИО и г.р. человека
    let headerName = $(
      "body > div.navbar.navbar-static-top > div > div > div > div > span"
    ).text();
    let reg = /.*/g;
    let headerNameArray = reg.exec(headerName);
    data.userFullName = headerNameArray[0];

    // Получение только ФИО (на всякий случай, если нужно будет)
    // let header_name = $('body > div.navbar.navbar-static-top > div > div > div > div > span').text();
    // let reg = /.*\(/g;
    // let header_name_new = reg.exec(header_name);
    // let name = header_name_new[0].replace( ' (','' );
    // data['name'] = name;

    // Название специальности
    let headerSpeciality = $(
      "body > div.navbar.navbar-static-top > div > div > div > div > span > span:nth-child(1)"
    ).text();
    data.speciality = headerSpeciality;

    // Форма обчуения
    let headerFormEducationForm = $(
      "body > div.navbar.navbar-static-top > div > div > div > div > span > span:nth-child(2)"
    ).text();
    data.educationForm = headerFormEducationForm;

    // Текущий год обучения
    let headerYear = $(
      "body > div.navbar.navbar-static-top > div > div > div > div > span > span:nth-child(3)"
    ).text();
    data.year = headerYear;

    return data;
  }

  parseTimeTable(html) {
    let data = {};
    const $ = cheerio.load(html);
    // Способы добавления элемента в словарь:   data['header'] = header  |  data.header = header;

    return data;
  }
}
