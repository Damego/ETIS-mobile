import { load } from 'cheerio';

import { IRating } from '../models/rating';
import parseSessionData from './session';
import { getTextField } from './utils';

const numberRegex = /[0-9]+/;

export default function parseRating(html: string) {
  const $ = load(html);

  const data: IRating = {
    session: parseSessionData($),
    groups: [],
  };

  const table = $('.common');

  table.find('tr').each((index, element) => {
    if (index === 0) return;

    const tr = $(element, table);
    const tds = tr.find('td');

    const groupName = getTextField(tds.eq(0));
    const rawRating = getTextField(tds.eq(1));
    const [top, total] = numberRegex.exec(rawRating);

    const overall = {
      top: parseInt(top),
      total: parseInt(total),
    };

    const disciplineRanking = [];

    const $$ = load(tds.eq(1).attr('title'));
    $$('tr').each((ind, innerElement) => {
      if (ind === 0) return;

      const innerTds = $$('td', innerElement);

      const pre = [];
      for (let i = 0; i < 5; i++) {
        pre.push(getTextField(innerTds.eq(i)));
      }
      const [discipline, controlPoints, passedControlPoints, points, rawRating] = pre;
      const [top, total] = numberRegex.exec(rawRating);

      disciplineRanking.push({
        discipline,
        controlPoints: parseInt(controlPoints),
        passedControlPoints: parseInt(passedControlPoints),
        points: parseInt(points),
        top: parseInt(top),
        total: parseInt(total),
      });
    });

    data.groups.push({
      name: groupName,
      overall,
      disciplines: disciplineRanking,
    });
  });

  return data;
}
