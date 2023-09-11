import { load } from 'cheerio';

import { ISessionTeachPlan, ITeachPlanDiscipline } from '../models/teachPlan';
import { getTextField } from './utils';

const FIELDS_NUM = 5;

export default function parseShortTeachPlan(html) {
  const $ = load(html);
  const sessionName = $('h3').first().text().split(' ').at(-1);
  const data: ISessionTeachPlan[] = [];

  $('.common', html).each((index, table) => {
    const stringSession = `${index + 1} ${sessionName}`;
    const disciplines: ITeachPlanDiscipline[] = [];

    $('.cgrldatarow', table).each((ind, tr) => {
      const td = $(tr).find('td');

      // Со знака "{" начинаются дисциплины по выбору https://github.com/Damego/ETIS-mobile/issues/99
      let electiveOffset = 0;
      while (getTextField(td.eq(electiveOffset)) === '{') electiveOffset++;

      const fields = [];
      for (let i = 0; i < FIELDS_NUM + electiveOffset; i += 1) {
        fields.push(getTextField(td.eq(i + electiveOffset)));
      }
      const [name, reporting, classWorkHours, soloWorkHours, totalWorkHours] = fields;

      disciplines.push({
        name,
        reporting,
        classWorkHours: parseInt(classWorkHours),
        soloWorkHours: parseInt(soloWorkHours),
        totalWorkHours: parseInt(totalWorkHours),
      });
    });
    data.push({
      disciplines,
      stringSession,
    });
  });
  return data;
}
