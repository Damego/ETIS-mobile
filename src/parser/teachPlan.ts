import { load } from 'cheerio';

import { ISessionTeachPlan, ITeachPlanDiscipline } from '../models/teachPlan';
import { getTextField } from './utils';

const FIELDS_NUM = 5;

export default function parseShortTeachPlan(html: string) {
  const $ = load(html);
  const sessionName = $('h3').first().text().split(' ').at(-1);
  const data: ISessionTeachPlan[] = [];

  $('.common', html).each((index, table) => {
    const disciplines: ITeachPlanDiscipline[] = [];

    $('.cgrldatarow', table).each((ind, tr) => {
      const td = $(tr).find('td');

      // Со знака "{" начинаются дисциплины по выбору https://github.com/Damego/ETIS-mobile/issues/99
      let electiveOffset = 0;
      while (getTextField(td.eq(electiveOffset)) === '{') electiveOffset += 1;

      const fields = [];
      for (let i = 0; i < FIELDS_NUM + electiveOffset; i += 1) {
        fields.push(getTextField(td.eq(i + electiveOffset)));
      }
      const [name, reporting, classWorkHours, soloWorkHours, totalWorkHours] = fields;

      let id: string;
      let teachPlanId: string;

      const href = td.eq(electiveOffset).find('a').attr('href');
      if (href) {
        const [, searchParamsString] = href.split('?');
        const searchParams = new URLSearchParams(searchParamsString);
        id = searchParams.get('p_tpr_id');
        teachPlanId = searchParams.get('p_tpdl_id');
      }

      disciplines.push({
        id,
        teachPlanId,
        name,
        reporting,
        classWorkHours: parseInt(classWorkHours),
        soloWorkHours: parseInt(soloWorkHours),
        totalWorkHours: parseInt(totalWorkHours),
      });
    });
    data.push({
      disciplines,
      period: {
        name: sessionName,
        number: index + 1,
        string: `${index + 1} ${sessionName}`,
      },
    });
  });
  return data;
}
