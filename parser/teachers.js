import { load } from 'cheerio';

import { getTextField } from './utils';

const groupTeachers = (data) => {
  const dataGrouped = {};
  data.forEach((val) => {
    if (dataGrouped[val.subjectUntyped]) {
      dataGrouped[val.subjectUntyped].push(val);
    } else {
      dataGrouped[val.subjectUntyped] = [val];
    }
  });

  return Object.entries(dataGrouped);
};

export default function parseTeachers(html) {
  const $ = load(html);
  let data = [];

  $('.teacher_info', html).each((index, element) => {
    const teacher = $(element);

    const photo = teacher.find('img').attr('src');
    const photoTitle = teacher.find('img').attr('title');
    const name = getTextField(teacher.find('.teacher_name'));
    const cathedra = getTextField(teacher.find('.chair'));
    const subject = getTextField(teacher.find('.dis'));
    const [subjectUntyped, subjectType] = subject.trim().split('(');

    data.push({
      photo,
      name,
      cathedra,
      subjectUntyped,
      subjectType: subjectType.slice(0, -1),
      photoTitle,
    });
  });

  return groupTeachers(data);
}
