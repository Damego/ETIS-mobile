import { load } from 'cheerio';

import { IMessage, IMessageFile, IMessagesData, MessageType } from '../models/messages';
import { getTextField } from './utils';

const getMessageFiles = ($: cheerio.Root, message: cheerio.Cheerio): IMessageFile[] => {
  const files: IMessageFile[] = [];

  message.find('a').each((index, element) => {
    const link = $(element, message);
    files.push({
      name: link.text(),
      uri: link.attr('href'),
    });
  });

  return files;
};

const getMessageContent = (message: cheerio.Cheerio): string =>
  getTextField(
    message
      .find('li')
      .contents()
      .filter(function () {
        return this.type === 'text';
      })
  );

const parseTeacherMessage = (message: cheerio.Cheerio): IMessage => {
  const fontComponent = message.find('font');
  const bComponent = message.find('b');

  const type = MessageType.teacherReply;
  const time = getTextField(fontComponent.eq(0));
  const author = getTextField(bComponent.eq(0));
  const content = getMessageContent(message)

  return {
    type,
    time,
    author,
    content,
  };
};

const parseStudentMessage = ($: cheerio.Root, message: cheerio.Cheerio): IMessage => {
  const fontComponent = message.find('font');

  const type = MessageType.studentReply;
  const time = getTextField(fontComponent.eq(0));
  const content = getMessageContent(message)
  const files = getMessageFiles($, message);

  let answerMessageID;
  message.find('input').each((index, element) => {
    const input = $(element, message);
    if (input.attr('type') === 'button') {
      answerMessageID = input.attr('id').split('_').at(-1);
    }
  });

  return {
    type,
    time,
    files,
    content,
    answerMessageID,
  };
};

const parseStartMessage = ($: cheerio.Root, message: cheerio.Cheerio): IMessage => {
  const fontComponent = message.find('font');
  const bComponent = message.find('b');

  const type = MessageType.message;
  const author = getTextField(bComponent.eq(0));
  const fields = [];
  for (let i = 0; i < 2; i++) {
    fields[i] = getTextField(fontComponent.eq(i));
  }
  const [time, subject] = fields;

  const theme = !fontComponent.eq(2).parent().is('form') ? getTextField(fontComponent.eq(2)) : null;
  const files = getMessageFiles($, message);

  const content = getMessageContent(message)

  let messageID;
  let answerID;
  message.find('input').each((index, element) => {
    const input = $(element, message);
    if (input.attr('type') === 'hidden') answerID = input.attr('value');
    else if (input.attr('type') === 'button') messageID = input.attr('id').split('_').at(1);
  });

  return {
    type,
    time,
    author,
    subject,
    theme,
    content,
    files,
    answerID,
    messageID,
  };
};

export default function parseMessages(html: string) {
  const $ = load(html);

  const page = parseInt(getTextField($('.week.current')));
  const lastPage = parseInt(getTextField($('.week').last()));

  const data: IMessagesData = {
    messages: [],
    page,
    lastPage
  }
  const { messages } = data;
  let messageThemeIndex = -1;

  $('.nav.msg', html).each((el, messageElement) => {
    const message = $(messageElement);

    if (message.hasClass('repl_t')) {
      messages[messageThemeIndex].push(parseTeacherMessage(message));
    } else if (message.hasClass('repl_s')) {
      messages[messageThemeIndex].push(parseStudentMessage($, message));
    } else {
      messageThemeIndex += 1;
      messages.push([parseStartMessage($, message)]);
    }
  });
  return data;
}
