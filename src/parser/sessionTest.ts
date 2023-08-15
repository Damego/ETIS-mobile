import cheerio from 'cheerio';

import { ISessionTest } from '../models/sessionTest';
import { getTextField } from './utils';

export default function parseSessionTest(html: string) {
  const $ = cheerio.load(html);

  const form = $('.que_form');
  const data: ISessionTest = {
    meta: {},
    teacher: null,
    themes: [],
  };

  let index = -1;

  form.children().each((elIndex, el) => {
    const element = $(el, form);

    // Бесполезная информация для нас, но важная для ЕТИС
    if (element.is('input')) {
      data.meta[element.attr('name')] = element.attr('value');
    }
    if (element.hasClass('question')) {
      const input = element.find('input').first();
      data.teacher = {
        name: getTextField(input.parent()),
        id: input.attr('value'),
      };
    }

    if (element.is('h3')) {
      index += 1;
      data.themes.push({
        title: getTextField(element),
        answerTitles: [],
        questions: [],
      });
    }
    if (element.hasClass('question_table')) {
      element.find('tr').each((trIndex, trElement) => {
        const tr = $(trElement, element);

        if (trIndex === 0) {
          tr.children().each((tdIndex, tdElement) => {
            if (tdIndex === 0) return;

            const td = $(tdElement, tr);
            data.themes[index].answerTitles.push(getTextField(td));
          });
          return;
        }

        const question = {
          name: null,
          answers: [],
        };

        tr.find('td').each((tdIndex, tdElement) => {
          const td = $(tdElement, tr);

          if (td.hasClass('text')) {
            question.name = getTextField(td).replaceAll("\n", "");
          } else {
            const input = td.find('input');

            question.answers.push({ id: input.attr('name'), value: input.attr('value') });
          }
        });

        data.themes[index].questions.push(question);
      });
    }
  });

  return data;
}
