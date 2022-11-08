import cheerio from "cheerio";

export default class DataParsing {
  isLoginPage(_cheerio) {
    let loginDiv = _cheerio(".login");
    return !!loginDiv;
  }

  parseHeader(html) {
    let data = {};
    const $ = cheerio.load(html);
    if (this.isLoginPage($)) {
      return null;
    }
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

  //Парсинг расписания
  parseTimeTable(html) {
    const $ = cheerio.load(html);
    if (this.isLoginPage($)) {
      return null;
    }

    let data = [];
    $("body > div.container > div > div.span9 > div.timetable > div").each(
      (i) => {
        // Создаем словарь i дня
        data.push({});
        // Дата (ч.м.)
        $(
          `body > div.container > div > div.span9 > div.timetable > div:nth-child(${
            i + 1
          }) > h3`
        ).each((el, date) => {
          let reg = /[0-9].*/;
          let dateReg = reg.exec($(date).text());
          data[i].date = dateReg[0];
        });

        data[i].lessons = [];
        $(
          `body > div.container > div > div.span9 > div.timetable > div:nth-child(${
            i + 1
          }) > table > tbody > tr`
        ).each((cnt, line) => {
          // Создаем урок в виде словаря
          data[i].lessons.push({});

          // Аудитория
          $(
            `body > div.container > div > div.span9 > div.timetable > div:nth-child(${
              i + 1
            }) > table > tbody > tr:nth-child(${
              cnt + 1
            }) > td.pair_info > div > div:nth-child(2) > span`
          ).each((el, audience) => {
            let reg = /ауд.*\)$/gm;
            let audienceReg = reg.exec($(audience).text());
            data[i].lessons[cnt].audience = audienceReg[0];
          });

          // Номер пары
          $(
            `body > div.container > div > div.span9 > div.timetable > div:nth-child(${
              i + 1
            }) > table > tbody > tr:nth-child(${cnt + 1}) > td.pair_num`
          ).each((el, lesson) => {
            let reg = /[0-9].*а/;
            let lessonReg = reg.exec($(lesson).text());
            data[i].lessons[cnt].lesson = lessonReg[0];
          });

          // Предмет
          $(
            `body > div.container > div > div.span9 > div.timetable > div:nth-child(${
              i + 1
            }) > table > tbody > tr:nth-child(${
              cnt + 1
            }) > td.pair_info > div > div:nth-child(1) > span.dis > a`
          ).each((el, subject) => {
            data[i].lessons[cnt].subject = $(subject).text();
          });

          // Время пары
          $(
            `body > div.container > div > div.span9 > div.timetable > div:nth-child(${
              i + 1
            }) > table > tbody > tr:nth-child(${cnt + 1}) > td.pair_num`
          ).each((el, time) => {
            let reg = /\d*:\d+/;
            let timeReg = reg.exec($(time).text());
            data[i].lessons[cnt].time = timeReg[0];
          });
        });
      }
    );
    return data;
  }
}
