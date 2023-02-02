import cheerio, { Cheerio, html } from "cheerio";

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

  //Парсинг расписания
  parseTimeTableV2(html) {
    const $ = cheerio.load(html);
    let data = [];
    $('.day', html).each((el, day) => {
      let lessons = [];
      const date = $(day).find('h3').text();
      if($(day).children().last().hasClass('no_pairs')) {
        const subject = $(day).children().last().text();
        lessons.push({
          audience : "",
          subject,
          time : ""
        })
      }
      else {
        $('tr', day).each((_, tr) => {
          const audience = $(tr).find(".pair_info").find(".aud").text();
          const subject = $(tr).find(".pair_info").find(".dis").text();
          const time = $(tr).find(".pair_num").find(".eval").text();
          lessons.push({
            audience,
            subject,
            time
          })
        })
      }
      data.push({
        date,
        lessons
      });
    });
    return data;
  }

  parseTeachers(html) {
    const $ = cheerio.load(html);
    let data = [];
    $('.teacher_info', html).each((el, teacher) => {
      const photo = $(teacher).find('img').attr('src');
      const name = $(teacher).find('.teacher_name').text();
      const cathedra = $(teacher).find('.chair').text();
      const subject = $(teacher).find('.dis').text();
      data.push({
        photo,
        name,
        cathedra,
        subject
      });
    });
    return data;
  }

  parseAnnounce(html) {
    const $ = cheerio.load(html);
    let data = [];
    $('.nav.msg', html).each((el, announce) => {
      const time = /\d+.\d+.\d+\s\d+\:\d+\:\d+/gm.exec($(announce).text())[0];
      const author = /[А-Я]{1}[а-я]{1,15}\s[А-Я]\.\s[А-Я]\./mg.exec($(announce).text())[0];
      let info = $(announce).text();
      info = info.replace(time, '');
      info = info.replace(author, '');
      data.push({
        time,
        info,
        author
      });
    })
    return data;
  }

  parseTeacherNotes(html) {
    const $ = cheerio.load(html);
    let data = [];
    let cnt = -1;
    $('.nav.msg', html).each((el, announce) => {
      if ($(announce).hasClass('repl_t')) {
        const type = "repl_t";
        let time = $(announce).find('font').eq(0).text();
        let author = $(announce).find('b').eq(0).text();
        let content = $(announce).find('li').contents().filter(function () {
          return this.type === "text";
        }).text();
        data[cnt].push({
          type,
          time,
          author,
          content
        })
      }
      else if($(announce).hasClass('repl_s')) {
        const type = "repl_s";
        let time = $(announce).find('font').eq(0).text();
        let content = $(announce).find('li').contents().filter(function () {
          return this.type === "text";
        }).text();
        data[cnt].push({
          type,
          time,
          content
        })
      }
      else {
        cnt++;
        const type = "msg";
        let time = $(announce).find('font').eq(0).text();
        let author = $(announce).find('b').eq(0).text();
        let subject = $(announce).find('font').eq(1).text();
        let theme = $(announce).find('font').eq(2).text();
        let content = $(announce).find('li').contents().filter(function () {
          return this.type === "text";
        }).text();
        data.push([
            {
              type,
              time,
              author,
              subject,
              theme,
              content
            }
          ])
      }
    });
    console.log(data);
    return data;
  }

  parseAbsenses(html) {
    const $ = cheerio.load(html);
    let data = [];
    $('tr', html).each((el, tableRow) => {
      if (el != 0) {
        const number = $(tableRow).find('td').eq(0).text();
        const time = $(tableRow).find('td').eq(1).text();
        const subject = $(tableRow).find('td').eq(2).text();
        const type = $(tableRow).find('td').eq(3).text();
        const teacher = $(tableRow).find('td').eq(4).text();
        data.push({
          number,
          time,
          subject,
          type,
          teacher
        });
      }
    })
    return data;
  }

  // only for p_mode = short
  parseTeachPlan(html) {
    const $ = cheerio.load(html);
    let data = [];
    $('.common', html).each((el, table) => {
      const trimester = `${el+1} триместр`;
      let subjects = [];
      $('.cgrldatarow', table).each((el, tr) => {
        const subject = $(tr).find('td').eq(0).text();
        const reporting = $(tr).find('td').eq(1).text();
        const classWork = $(tr).find('td').eq(2).text();
        const soloWork = $(tr).find('td').eq(3).text();
        const total = $(tr).find('td').eq(4).text();
        subjects.push({
          subject,
          reporting,
          classWork,
          soloWork,
          total
        })
      })
      data.push({
        trimester,
        subjects
      })
    })
    return data;
  }

  // only for p_mode = current
  parseSigns(html) {
    const $ = cheerio.load(html);
    let data = [];
    $('.common', html).each((el, table) => {
      let info = [];
      $('tr', table).each((i, tr) => {
        const theme = $(tr).find('td').eq(0).text();
        const typeWork = $(tr).find('td').eq(1).text();
        const typeControl= $(tr).find('td').eq(2).text();
        const mark = $(tr).find('td').eq(3).text();
        const passScore = $(tr).find('td').eq(4).text();
        const currentScore = $(tr).find('td').eq(5).text();
        const maxScore = $(tr).find('td').eq(6).text();
        const date = $(tr).find('td').eq(7).text();
        const teacher = $(tr).find('td').eq(8).text();
        info.push({
          theme,
          typeWork,
          typeControl,
          mark,
          passScore,
          currentScore,
          maxScore,
          date,
          teacher
        })
      })
      info.splice(0, 2);
      info.splice(-1, 1);
      data.push({
        info
      })
    })
    $('h3', html).each((el, name) => {
      const subject = $(name).text();
      data[el].subject = subject;
    })
    return data;
  }
}