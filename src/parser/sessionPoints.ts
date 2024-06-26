import { load } from 'cheerio';

import { ICheckPoint, ISessionPoints } from '../models/sessionPoints';
import { getAsNumber, getTextField } from './utils';

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
      const tr = $(trElement);
      if (tr.find('th').length !== 0) {
        return;
      }

      const failed = !!tr.attr('style');
      const tds = tr.find('td');
      const fields = [];

      for (let j = 0; j < 9; j += 1) {
        fields.push(getTextField(tds.eq(j)));
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

      const updatesUrl = '/' + tds.eq(3).attr('data-url');

      const points = getAsNumber(rawPoints, 0);
      const isAbsent = rawPoints === 'н';
      const hasPoints = rawPoints !== '';

      checkPoints.push({
        theme,
        typeWork,
        typeControl,
        points,
        isAbsent,
        passScore: getAsNumber(passScore, 0),
        currentScore: getAsNumber(currentScore, 0),
        maxScore: getAsNumber(maxScore, 0),
        isIntroductionWork: getAsNumber(maxScore) === 0.0,
        date,
        updatesUrl,
        teacher,
        hasPoints,
        failed,
      });
    });

    checkPoints.splice(-1, 1);

    const totalPoints = getAsNumber(getTextField(trs.eq(-1).find('td').eq(1)), 0);

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
