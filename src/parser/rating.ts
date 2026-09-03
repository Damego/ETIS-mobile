import { load } from 'cheerio';

import { IDisciplineRanking, ISessionRating, OverallRating } from '../models/rating';
import parseSessionData from './session';
import { getTextField } from './utils';

const numberRegex = /\d+/gm;

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

    let overall: OverallRating | undefined;
    if (rawRating) {
      const [top, total] = rawRating.match(numberRegex) ?? [];

      overall = {
        top: parseInt(top ?? ''),
        total: parseInt(total ?? ''),
      };
    }

    const disciplineRanking: IDisciplineRanking[] = [];

    const $$ = load(tds.eq(1).attr('title') ?? '');
    $$('tr').each((ind, innerElement) => {
      if (ind === 0) return;

      const innerTds = $$('td', innerElement);

      const pre: string[] = [];
      for (let i = 0; i < 5; i += 1) {
        pre.push(getTextField(innerTds.eq(i)));
      }
      const [discipline, controlPoints, passedControlPoints, points, innerRawRating] = pre;
      const [top, total] = innerRawRating.match(numberRegex) ?? [];

      disciplineRanking.push({
        discipline,
        controlPoints: parseInt(controlPoints),
        passedControlPoints: parseInt(passedControlPoints),
        points: parseInt(points),
        top: parseInt(top ?? ''),
        total: parseInt(total ?? ''),
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
