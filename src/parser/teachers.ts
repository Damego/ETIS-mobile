import { load } from 'cheerio';

import { ITeacher, TeacherType } from '../models/teachers';
import { executeRegex } from '../utils/sentry';
import { getTextField } from './utils';

/* https://regex101.com/r/gvUVMt/5 */
/* duplicated in sentry.ts */
const subjectRegex =
  /([а-яА-Я\w\s":.,+#-]+ (?:\([а-яА-Я\w\s]+\) )?(?:\[[а-яА-Я\w\s,]+] )*)\(([а-яА-Я\s,.-]+)\)/s;
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
    const teacherEl = $(element);
    const id = Number(teacherEl.attr('id'));
    const photo = teacherEl.find('img').attr('src');
    const photoTitle = teacherEl.find('img').attr('title');
    const name = getTextField(teacherEl.find('.teacher_name'));
    const cathedra = getTextField(teacherEl.find('.chair'));

    getTextField(teacherEl.find('.dis'))
      .split('\n')
      .forEach((subject) => {
        const [, subjectUntyped, subjectType] = executeRegex(subjectRegex, subject);
        data.push({
          id,
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
