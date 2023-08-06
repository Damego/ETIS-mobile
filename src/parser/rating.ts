import { load } from 'cheerio';

import { ISessionRating, OverallRating } from '../models/rating';
import parseSessionData from './session';
import { getTextField } from './utils';

const numberRegex = /[0-9]+/gm;

export default function parseRating(html: string) {
  const $ = load(html);

  const data: ISessionRating = {
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

    let overall: OverallRating;
    if (rawRating) {
      const [top, total] = rawRating.match(numberRegex);

      overall = {
        top: parseInt(top),
        total: parseInt(total),
      };
    }

    const disciplineRanking = [];

    const $$ = load(tds.eq(1).attr('title'));
    $$('tr').each((ind, innerElement) => {
      if (ind === 0) return;

      const innerTds = $$('td', innerElement);

      const pre: string[] = [];
      for (let i = 0; i < 5; i++) {
        pre.push(getTextField(innerTds.eq(i)));
      }
      const [discipline, controlPoints, passedControlPoints, points, rawRating] = pre;
      const [top, total] = rawRating.match(numberRegex);

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
