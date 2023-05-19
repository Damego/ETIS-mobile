import { load } from 'cheerio';
import { getTextField } from './utils';

export default function parseCurrentPoints(html) {
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

      for (let j = 0; j < 9; j++) {
        fields[j] = getTextField(td.eq(j));
      }
      const [
        theme,
        typeWork,
        typeControl,
        rawMark,
        passScore,
        currentScore,
        maxScore,
        date,
        teacher,
      ] = fields;

      const mark = parseFloat(rawMark);
      const isAbsent = rawMark === 'н';
      info.push({
        theme,
        typeWork,
        typeControl,
        mark,
        isAbsent,
        passScore: parseFloat(passScore),
        currentScore: parseFloat(currentScore),
        maxScore: parseFloat(maxScore),
        date,
        teacher,
      });
    });
    info.splice(0, 2);
    info.splice(-1, 1);
    data.subjects.push({
      info,
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
  data.latestTrimester = $('.submenu-item', subMenu).last().index();

  return data;
}