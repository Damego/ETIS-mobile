import { load } from 'cheerio';

import { getTextField } from './utils';

export default function parseSessionPoints(html) {
  const $ = load(html);
  let data = {
    subjects: [],
    currentTrimester: null,
    latestTrimester: null,
  };
  $('.common', html).each((el, table) => {
    let info = [];
    $('tr', table).each((i, tr) => {
      const td = $(tr).find('td');
      const fields = [];

      for (let j = 0; j < 9; j += 1) {
        fields[j] = getTextField(td.eq(j));
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
      info.push({
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
    info.splice(0, 2);
    info.splice(-1, 1);
    data.subjects.push({
      info,
      mark: null,
    });
  });
  $('h3', html).each((el, name) => {
    data.subjects[el].subject = getTextField($(name));
  });

  const subMenu = $('.submenu').last();
  $('.submenu-item', subMenu).each((i, el) => {
    if (!getTextField($('a', el))) {
      data.currentTrimester = i + 1;
      return false;
    }
  });
  data.latestTrimester = $('.submenu-item', subMenu).last().index() + 1;

  return data;
}