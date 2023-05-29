import { load } from 'cheerio';

import { ICheckPoint, ISessionPoints } from '../models/sessionPoints';
import { getTextField } from './utils';

export default function parseSessionPoints(html): ISessionPoints {
  const $ = load(html);
  const data: ISessionPoints = {
    subjects: [],
    currentSession: null,
    latestSession: null,
    sessionName: null,
  };
  $('.common', html).each((index, tableElement) => {
    const table = $(tableElement);
    const checkPoints: ICheckPoint[] = [];

    const trs = table.find('tr');
    trs.each((i, trElement) => {
      // @ts-ignore
      const tr = $(trElement, trs);
      if (tr.find('th').length !== 0) {
        return;
      }

      const td = tr.find('td');
      const fields = [];

      for (let j = 0; j < 9; j += 1) {
        fields.push(getTextField(td.eq(j)));
      }
      const [
        theme,
        typeWork,
        typeControl,
        rawPoints,
        passScore,
        currentScore,
        maxScore,
        date,
        teacher,
      ] = fields;

      const points = parseFloat(rawPoints);
      const isAbsent = rawPoints === 'н';
      checkPoints.push({
        theme,
        typeWork,
        typeControl,
        points,
        isAbsent,
        passScore: parseFloat(passScore),
        currentScore: parseFloat(currentScore),
        maxScore: parseFloat(maxScore),
        isIntroductionWork: parseFloat(maxScore) === 0.0,
        date,
        teacher,
      });
    });

    checkPoints.splice(-1, 1);

    let totalPoints = parseFloat(getTextField(trs.eq(-1).find('td').eq(1)));
    if (Number.isNaN(totalPoints)) totalPoints = 0;

    data.subjects.push({
      checkPoints,
      totalPoints,
      mark: null,
    });
  });
  $('h3', html).each((index, element) => {
    data.subjects[index].name = getTextField($(element));
  });

  const subMenu = $('.submenu').last();
  $('.submenu-item', subMenu).each((i, el) => {
    if (!getTextField($('a', el))) {
      data.currentSession = i + 1;
      return false;
    }
  });
  const latestSession = $('.submenu-item', subMenu).last();
  data.latestSession = latestSession.index() + 1;
  data.sessionName = getTextField(latestSession).split(' ').at(-1);

  return data;
}
