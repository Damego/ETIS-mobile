import * as cheerio from 'cheerio';

export default class DataParsing {
  constructor() {
    this.hasUserData = false;
    this.userData = {
      announceCount: null,
      messageCount: null,
      student: {
        name: null,
        speciality: null,
        educationForm: null,
        year: null,
        group: null,
      },
    };
  }

  isLoginPage(html) {
    const $ = cheerio.load(html);
    return !!$('.login').html();
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
      const photoTitle = $(teacher).find('img').attr('title');
      const name = $(teacher).find('.teacher_name').text().trim();
      const cathedra = $(teacher).find('.chair').text().trim();
      const subject = $(teacher).find('.dis').text().trim();
      const [subjectUntyped, subjectType] = subject.trim().split('(');
      data.push({
        photo,
        name,
        cathedra,
        subjectUntyped,
        subjectType: subjectType.slice(0, -1),
        photoTitle,
      });
    });
    return data;
  }

  parseAnnounce(html) {
    const $ = cheerio.load(html);
    let data = [];

    // Let WebView work with this shit
    $('.nav.msg').each((index, el) => {
      // source code is fucked up. WebView is fucked up (it always throws an error if link tag doesn't have a target)
      // So why my code can't be fucked up?
      const messageHtml = $(el)
        .html()
        .replaceAll('<a', `<a target="_blank"`)
        .replaceAll(`href="df_pkg.`, `href="https://student.psu.ru/pls/stu_cus_et/df_pkg.`)
        .replaceAll(
          `<a target="_blank" target="_blank" href="https://student.psu.ru/pls/stu_cus_et/df_pkg.`,
          `<a href="https://student.psu.ru/pls/stu_cus_et/df_pkg.`
        );
      data.push(messageHtml);
    });

    return data;
  }

  parseTeacherNotes(html) {
    const $ = cheerio.load(html);
    let data = [];
    let cnt = -1;
    $('.nav.msg', html).each((el, announce) => {
      if ($(announce).hasClass('repl_t')) {
        const type = 'teacher_reply';
        let time = $(announce).find('font').eq(0).text();
        let author = $(announce).find('b').eq(0).text();
        let content = $(announce)
          .find('li')
          .contents()
          .filter(function () {
            return this.type === 'text';
          })
          .text()
          .trim();
        data[cnt].push({
          type,
          time,
          author,
          content,
        });
      } else if ($(announce).hasClass('repl_s')) {
        const type = 'student_reply';
        let time = $(announce).find('font').eq(0).text();
        let content = $(announce)
          .find('li')
          .contents()
          .filter(function () {
            return this.type === 'text';
          })
          .text()
          .trim();
        data[cnt].push({
          type,
          time,
          content,
        });
      } else {
        cnt += 1;
        const type = 'message';
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
          .text()
          .trim();
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
        const td = $(tr).find('td');
        let isElective = td.eq(0).text().trim() === '{';
        const fields = [];
        for (let i = 0; i < isElective + 5; i++) {
          fields[i] = td
            .eq(isElective + i)
            .text()
            .trim();
        }
        const [subject, reporting, classWork, soloWork, total] = fields;

        subjects.push({
          subject,
          reporting,
          classWork,
          soloWork,
          total,
        });
      });
      data.push({
        subjects,
        trimestr,
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

  parseMenu(html, parseGroupJournal = false) {
    const $ = cheerio.load(html);

    const data = {
      announceCount: null,
      messageCount: null,
      student: {
        name: null,
        speciality: null,
        educationForm: null,
        year: null,
        group: null,
      },
    };

    // Получение информации о студенте

    const rawData = $('.span12').text().trim();
    const [rawName, speciality, form, year] = rawData.split('\n').map((string) => string.trim());
    const [name1, name2, name3] = rawName.split(' ');
    data.student.name = `${name1} ${name2} ${name3}`;
    data.student.speciality = speciality;
    data.student.educationForm = form;
    data.student.year = year;

    if (parseGroupJournal) {
      data.student.group = $('.span9').find('h3').text().split(' ')[1];
    }

    // Получения количества новых объявлений
    $('.nav.nav-tabs.nav-stacked')
      .find('.badge')
      .each((i, el) => {
        const span = $(el);
        const href = span.parent().attr('href');
        if (href === 'stu.announce') {
          data.announceCount = parseInt(span.text());
        } else if (href === 'stu.teacher_notes') {
          data.messageCount = parseInt(span.text());
        }
      });

    this.userData = data.student;
    this.hasUserData = true;
    return data;
  }
}