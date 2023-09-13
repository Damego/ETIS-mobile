import { load } from 'cheerio';

import { ITeacher, TeacherType } from '../models/teachers';
import { getTextField } from './utils';
import { executeRegex } from '../utils/sentry';

/* https://regex101.com/r/gvUVMt/4 */
/* duplicated in sentry.ts */
const subjectRegex =
  /([а-яА-Я\w\s":.,+#-]+ (?:\([а-яА-Я\w\s]+\) )?(?:\[[а-яА-Я\w\s,]+] )?)\(([а-яА-Я\s,.-]+)\)/s;
const groupTeachers = (data: ITeacher[]) => {
  const dataGrouped = {};
  data.forEach((val) => {
    if (dataGrouped[val.subjectUntyped]) {
      dataGrouped[val.subjectUntyped].push(val);
    } else {
      dataGrouped[val.subjectUntyped] = [val];
    }
  });

  return Object.entries<ITeacher[]>(dataGrouped);
};

export default function parseTeachers(html): TeacherType {
  const $ = load(html);
  const data: ITeacher[] = [];

  $('.teacher_info', html).each((index, element) => {
    const teacherEl = $(element),
      photo = teacherEl.find('img').attr('src'),
      photoTitle = teacherEl.find('img').attr('title'),
      name = getTextField(teacherEl.find('.teacher_name')),
      cathedra = getTextField(teacherEl.find('.chair'));

    getTextField(teacherEl.find('.dis'))
      .split('\n')
      .forEach((subject) => {
        const [_, subjectUntyped, subjectType] = executeRegex(subjectRegex, subject);
        data.push({
          photo,
          name,
          cathedra,
          subjectUntyped,
          subjectType,
          photoTitle,
        });
      });
  });

  return groupTeachers(data);
}
