import { load } from 'cheerio';
import { getTextField } from './utils';

export default function parseShortTeachPlan(html) {
  const $ = load(html);
  let data = [];

  $('.common', html).each((index, table) => {
    const trimester = `${index + 1} триместр`;
    let subjects = [];

    $('.cgrldatarow', table).each((ind, tr) => {
      const td = $(tr).find('td');

      let isElective = getTextField(td.eq(0)) === '{';

      const fields = [];
      for (let i = 0; i < isElective + 5; i += 1) {
        fields[i] = getTextField(td.eq(isElective + i));
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
