import { load } from 'cheerio';
import { getTextField } from './utils';
import { ISessionTeachPlan, ITeachPlanDiscipline } from '../models/teachPlan';

export default function parseShortTeachPlan(html) {
  const $ = load(html);
  const sessionName = $('h3').first().text().split(' ').at(-1);
  const data: ISessionTeachPlan[] = [];

  $('.common', html).each((index, table) => {
    const stringSession = `${index + 1} ${sessionName}`;
    const disciplines: ITeachPlanDiscipline[] = [];

    $('.cgrldatarow', table).each((ind, tr) => {
      const td = $(tr).find('td');

      const electiveLimit = Number(getTextField(td.eq(0)) === '{');

      const fields = [];
      for (let i = 0; i < electiveLimit + 5; i += 1) {
        fields.push(getTextField(td.eq(electiveLimit + i)));
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
