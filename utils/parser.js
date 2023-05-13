import * as cheerio from 'cheerio';
import moment from 'moment';

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

  getTextField(component) {
    return component.text().trim();
  }

  parseDate(dateString) {
    return moment(dateString, 'DD.MM.YYYY HH:mm:ss');
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
      const date = this.getTextField(daySelector.find('h3'));

      if (!daySelector.children().last().hasClass('no_pairs')) {
        $('tr', day).each((_, tr) => {
          const trSelector = $(tr);
          const audience = this.getTextField(trSelector.find('.pair_info').find('.aud'));
          const subject = this.getTextField(trSelector.find('.pair_info').find('.dis'));
          const time = this.getTextField(trSelector.find('.pair_num').find('.eval'));
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
      const name = this.getTextField($(teacher).find('.teacher_name'));
      const cathedra = this.getTextField($(teacher).find('.chair'));
      const subject = this.getTextField($(teacher).find('.dis'));
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
    $('.nav.msg', html).each((el, messageElement) => {
      const message = $(messageElement);
      const fontComponent = message.find('font');
      const bComponent = message.find('b');
      if (message.hasClass('repl_t')) {
        const type = 'teacher_reply';
        let time = this.parseDate(this.getTextField(fontComponent.eq(0)));
        let author = this.getTextField(bComponent.eq(0));
        let content = this.getTextField(
          message
            .find('li')
            .contents()
            .filter(function () {
              return this.type === 'text';
            })
        );
        data[cnt].push({
          type,
          time,
          author,
          content,
        });
      } else if (message.hasClass('repl_s')) {
        const type = 'student_reply';
        let time = this.parseDate(this.getTextField(fontComponent.eq(0)));
        let content = this.getTextField(
          message
            .find('li')
            .contents()
            .filter(function () {
              return this.type === 'text';
            })
        );

        const files = [];
        message.find('a').each((index, element) => {
          const link = $(element, message);
          files.push({
            fileName: link.text(),
            uri: link.attr('href'),
          });
        });

        data[cnt].push({
          type,
          time,
          files,
          content,
        });
      } else {
        cnt += 1;
        const type = 'message';
        let author = this.getTextField(bComponent.eq(0));
        const fields = [];
        for (let i = 0; i < 2; i++) {
          fields[i] = this.getTextField(fontComponent.eq(i));
        }
        const [time, subject] = fields;

        const theme = !fontComponent.eq(2).parent().is('form')
          ? this.getTextField(fontComponent.eq(2))
          : null;

        const files = [];
        message.find('a').each((index, element) => {
          const link = $(element, message);
          files.push({
            fileName: link.text(),
            uri: link.attr('href'),
          });
        });

        const content = this.getTextField(
          message
            .find('li')
            .contents()
            .filter(function () {
              return this.type === 'text';
            })
        );

        data.push([
          {
            type,
            time: this.parseDate(time),
            author,
            subject,
            theme,
            content,
            files,
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
      if (el !== 0) {
        const td = $(tableRow).find('td');
        const fields = [];
        for (let i = 0; i < 5; i++) {
          fields[i] = this.getTextField(td.eq(i));
        }
        const [number, time, subject, type, teacher] = fields;

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
      $('.cgrldatarow', table).each((_, tr) => {
        const td = $(tr).find('td');
        let isElective = this.getTextField(td.eq(0)) === '{';
        const fields = [];
        for (let i = 0; i < isElective + 5; i++) {
          fields[i] = this.getTextField(td.eq(isElective + i));
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
        trimester,
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
        const fields = [];

        for (let j = 0; j < 9; j++) {
          fields[j] = this.getTextField(td.eq(j));
        }
        const [
          theme,
          typeWork,
          typeControl,
          rawMark,
          passScore,
          currentScore,
          maxScore,
          date,
          teacher,
        ] = fields;

        const mark = parseFloat(rawMark);
        const isAbsent = rawMark === 'н';
        info.push({
          theme,
          typeWork,
          typeControl,
          mark,
          isAbsent,
          passScore: parseFloat(passScore),
          currentScore: parseFloat(currentScore),
          maxScore: parseFloat(maxScore),
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
      data.subjects[el].subject = this.getTextField($(name));
    });

    const subMenu = $('.submenu').last();
    $('.submenu-item', subMenu).each((i, el) => {
      if (!this.getTextField($('a', el))) {
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

    const rawData = this.getTextField($('.span12'));
    const [rawName, speciality, form, year] = rawData.split('\n').map((string) => string.trim());
    const [name1, name2, name3] = rawName.split(' ');
    data.student = {
      name: `${name1} ${name2} ${name3}`,
      speciality,
      educationForm: form,
      year,
    };

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
          data.announceCount = parseInt(this.getTextField(span));
        } else if (href === 'stu.teacher_notes') {
          data.messageCount = parseInt(this.getTextField(span));
        }
      });

    this.userData = data.student;
    this.hasUserData = true;
    return data;
  }
}
