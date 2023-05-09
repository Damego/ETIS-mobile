import * as cheerio from 'cheerio';

export default class DataParsing {
  isLoginPage(html) {
    const $ = cheerio.load(html);
    return !!$('.login').html();
  }

  parseHeader(html) {
    const data = {
      userFullName: null,
      headerSpeciality: null,
    };
    const {} = data;
    const $ = cheerio.load(html);
    // Способы добавления элемента в словарь:   data['header'] = header  |  data.header = header;

    // ФИО и г.р. человека
    const headerName = $(
      'body > div.navbar.navbar-static-top > div > div > div > div > span'
    ).text();
    const reg = /.*/g;
    data.userFullName = reg.exec(headerName)[0];

    // Получение только ФИО (на всякий случай, если нужно будет)
    // let header_name = $('body > div.navbar.navbar-static-top > div > div > div > div > span').text();
    // let reg = /.*\(/g;
    // let header_name_new = reg.exec(header_name);
    // let name = header_name_new[0].replace( ' (','' );
    // data['name'] = name;

    // Название специальности
    let headerSpeciality = $(
      'body > div.navbar.navbar-static-top > div > div > div > div > span > span:nth-child(1)'
    ).text();
    data.speciality = headerSpeciality;

    // Форма обчуения
    let headerFormEducationForm = $(
      'body > div.navbar.navbar-static-top > div > div > div > div > span > span:nth-child(2)'
    ).text();
    data.educationForm = headerFormEducationForm;

    // Текущий год обучения
    let headerYear = $(
      'body > div.navbar.navbar-static-top > div > div > div > div > span > span:nth-child(3)'
    ).text();
    data.year = headerYear;
    return data;
  }

  /**
   * Метод для парсинга страницы с расписанием.
   * @param {string} html
   */
  parseTimeTable(html) {
    const $ = cheerio.load(html);
    const week = $('.week');

    let data = {
      firstWeek: parseInt(week.first().text()),
      currentWeek: parseInt($('.week.current').text()),
      lastWeek: parseInt(week.last().text()),
      days: [],
    };

    const { days } = data;

    $('.day', html).each((el, day) => {
      const daySelector = $(day);
      let lessons = [];
      const date = daySelector.find('h3').text();

      if (!daySelector.children().last().hasClass('no_pairs')) {
        $('tr', day).each((_, tr) => {
          const trSelector = $(tr);
          const audience = trSelector.find('.pair_info').find('.aud').text().trim();
          const subject = trSelector.find('.pair_info').find('.dis').text().trim();
          const time = trSelector.find('.pair_num').find('.eval').text().trim();
          lessons.push({
            audience,
            subject,
            time,
          });
        });
      }
      days.push({
        date,
        lessons,
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
        subject,
      });
    });
    return data;
  }

  parseAnnounce(html) {
    const $ = cheerio.load(html);
    let data = [];

    // Let WebView work with this shit
    $('.nav.msg').each((index, el) => {
      // WebView is fucked, so I manually add target to every tag
      data.push($(el).html().replace("<a", `<a target="_blank"`));
    });

    return data;
  }

  parseTeacherNotes(html) {
    const $ = cheerio.load(html);
    let data = [];
    let cnt = -1;
    $('.nav.msg', html).each((el, announce) => {
      if ($(announce).hasClass('repl_t')) {
        const type = 'repl_t';
        let time = $(announce).find('font').eq(0).text();
        let author = $(announce).find('b').eq(0).text();
        let content = $(announce)
          .find('li')
          .contents()
          .filter(function () {
            return this.type === 'text';
          })
          .text();
        data[cnt].push({
          type,
          time,
          author,
          content,
        });
      } else if ($(announce).hasClass('repl_s')) {
        const type = 'repl_s';
        let time = $(announce).find('font').eq(0).text();
        let content = $(announce)
          .find('li')
          .contents()
          .filter(function () {
            return this.type === 'text';
          })
          .text();
        data[cnt].push({
          type,
          time,
          content,
        });
      } else {
        cnt += 1;
        const type = 'msg';
        let time = $(announce).find('font').eq(0).text();
        let author = $(announce).find('b').eq(0).text();
        let subject = $(announce).find('font').eq(1).text();
        let theme = $(announce).find('font').eq(2).text();
        let content = $(announce)
          .find('li')
          .contents()
          .filter(function () {
            return this.type === 'text';
          })
          .text();
        data.push([
          {
            type,
            time,
            author,
            subject,
            theme,
            content,
          },
        ]);
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
          teacher,
        });
      }
    });
    return data;
  }

  // only for p_mode = short
  parseTeachPlan(html) {
    const $ = cheerio.load(html);
    let data = [];
    $('.common', html).each((el, table) => {
      const trimester = `${el + 1} триместр`;
      let subjects = [];
      $('.cgrldatarow', table).each((el, tr) => {
        const subject = $(tr).find('td').eq(0).text().trim();
        const reporting = $(tr).find('td').eq(1).text().trim();
        const classWork = parseInt($(tr).find('td').eq(2).text().trim());
        const soloWork = parseInt($(tr).find('td').eq(3).text().trim());
        const total = parseInt($(tr).find('td').eq(4).text().trim());
        subjects.push({
          subject,
          reporting,
          classWork,
          soloWork,
          total,
        });
      });
      data.push({
        trimester,
        subjects,
      });
    });
    return data;
  }

  // only for p_mode = current
  parseSigns(html) {
    const $ = cheerio.load(html);
    let data = {
      subjects: [],
      currentTrimester: null,
      latestTrimester: null,
    };
    $('.common', html).each((el, table) => {
      let info = [];
      $('tr', table).each((i, tr) => {
        // TODO: yeeeeeeeeeeet this shit lol
        const td = $(tr).find('td');
        const theme = td.eq(0).text().trim();
        const typeWork = td.eq(1).text().trim();
        const typeControl = td.eq(2).text().trim();
        const rawMark = td.eq(3).text().trim();
        const mark = parseFloat(rawMark);
        const isAbsent = rawMark === 'н';
        const passScore = parseFloat(td.eq(4).text().trim());
        const currentScore = parseFloat(td.eq(5).text().trim());
        const maxScore = parseFloat(td.eq(6).text().trim());
        const date = td.eq(7).text().trim();
        const teacher = td.eq(8).text().trim();
        info.push({
          theme,
          typeWork,
          typeControl,
          mark,
          isAbsent,
          passScore,
          currentScore,
          maxScore,
          date,
          teacher,
        });
      });
      info.splice(0, 2);
      info.splice(-1, 1);
      data.subjects.push({
        info,
      });
    });
    $('h3', html).each((el, name) => {
      const subject = $(name).text();
      data.subjects[el].subject = subject;
    });

    const subMenu = $('.submenu').last();
    $('.submenu-item', subMenu).each((i, el) => {
      if (!$('a', el).text()) {
        data.currentTrimester = i + 1;
        return false;
      }
    });
    data.latestTrimester = $('.submenu-item', subMenu).last().index();

    return data;
  }

  parseMenu(html) {
    const $ = cheerio.load(html);

    const data = {
      announceCount: null,
      messageCount: null,
    };

    $('.nav.nav-tabs.nav-stacked')
      .find('.badge')
      .each((i, el) => {
        const span = $(el);
        if (span.parent().attr('href') === 'stu.announce') {
          data.announceCount = parseInt(span.text());
        }
      });
    return data;
  }
}
