import cheerio from "cheerio";

export default class DataParsing {
  parseHeader(html) {
    let data = {};
    const $ = cheerio.load(html);
    // Способы добавления элемента в словарь:   data['header'] = header  |  data.header = header;

    // Сленг ВУЗа
    let header_caption = $(
      "body > div.navbar.navbar-static-top > div > div > a"
    ).text();
    data["caption"] = header_caption;

    // ФИО и г.р. человека
    let header_name = $(
      "body > div.navbar.navbar-static-top > div > div > div > div > span"
    ).text();
    let reg = /.*/g;
    let header_name_array = reg.exec(header_name);
    let name_bd = header_name_array[0];
    data["name"] = name_bd;

    // Получение только ФИО (на всякий случай, если нужно будет)
    // let header_name = $('body > div.navbar.navbar-static-top > div > div > div > div > span').text();
    // let reg = /.*\(/g;
    // let header_name_new = reg.exec(header_name);
    // let name = header_name_new[0].replace( ' (','' );
    // data['name'] = name;

    // Название специальности
    let header_speciality = $(
      "body > div.navbar.navbar-static-top > div > div > div > div > span > span:nth-child(1)"
    ).text();
    data["speciality"] = header_speciality;

    // Форма обчуения
    let header_form_of_education = $(
      "body > div.navbar.navbar-static-top > div > div > div > div > span > span:nth-child(2)"
    ).text();
    data["form_of_education"] = header_form_of_education;

    // Текущий год обучения
    let header_year = $(
      "body > div.navbar.navbar-static-top > div > div > div > div > span > span:nth-child(3)"
    ).text();
    data["year"] = header_year;

    return data;
  }

  parseTimeTable(html) {
    let data = {};
    const $ = cheerio.load(html);
    // Способы добавления элемента в словарь:   data['header'] = header  |  data.header = header;

    return data;
  }
}
