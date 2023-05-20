import { load } from 'cheerio';

import { getTextField, parseDate } from './utils';

export default function parseTeacherMessages(html) {
  const $ = load(html);
  let data = [];
  let cnt = -1;
  $('.nav.msg', html).each((el, messageElement) => {
    const message = $(messageElement);
    const fontComponent = message.find('font');
    const bComponent = message.find('b');
    if (message.hasClass('repl_t')) {
      const type = 'teacher_reply';
      let time = parseDate(getTextField(fontComponent.eq(0)));
      let author = getTextField(bComponent.eq(0));
      let content = getTextField(
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
      let time = parseDate(getTextField(fontComponent.eq(0)));
      let content = getTextField(
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

      let answerMessageID;
      message.find('input').each((index, element) => {
        const input = $(element, message);
        if (input.attr('type') === 'button') {
          answerMessageID = input.attr('id').split('_').at(-1);
        }
      });

      data[cnt].push({
        type,
        time,
        files,
        content,
        answerMessageID,
      });
    } else {
      cnt += 1;
      const type = 'message';
      let author = getTextField(bComponent.eq(0));
      const fields = [];
      for (let i = 0; i < 2; i++) {
        fields[i] = getTextField(fontComponent.eq(i));
      }
      const [time, subject] = fields;

      const theme = !fontComponent.eq(2).parent().is('form')
        ? getTextField(fontComponent.eq(2))
        : null;

      const files = [];
      message.find('a').each((index, element) => {
        const link = $(element, message);
        files.push({
          fileName: link.text(),
          uri: link.attr('href'),
        });
      });

      const content = getTextField(
        message
          .find('li')
          .contents()
          .filter(function () {
            return this.type === 'text';
          })
      );

      let messageID;
      let answerID;
      message.find('input').each((index, element) => {
        const input = $(element, message);
        if (input.attr('type') === 'hidden') answerID = input.attr('value');
        else if (input.attr('type') === 'button') messageID = input.attr('id').split('_').at(1);
      });

      data.push([
        {
          type,
          time: parseDate(time),
          author,
          subject,
          theme,
          content,
          files,
          answerID,
          messageID,
        },
      ]);
    }
  });
  return data;
}
