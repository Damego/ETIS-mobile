import { load } from 'cheerio';

import { ITeacher, TeacherType } from '../models/teachers';
import { executeRegex } from '../utils/sentry';
import { getTextField } from './utils';

/* https://regex101.com/r/gvUVMt/14 */
const subjectRegex = /(.*)\s\(([а-я]+(?:,\s[а-я]+)*)\)/s;
const numberRegex = /(\d+)/s;

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

export default function parseTeachers(html: string): TeacherType {
  const $ = load(html);
  const data: ITeacher[] = [];

  $('.teacher_info', html).each((index, element) => {
    const teacherEl = $(element);
    const id = teacherEl.attr('id');
    const photo = teacherEl.find('img').attr('src');
    const photoTitle = teacherEl.find('img').attr('title');
    const name = getTextField(teacherEl.find('.teacher_name'));
    const cathedraTag = teacherEl.find('.chair');
    const cathedra = getTextField(cathedraTag);
    const [cathedraId] = executeRegex(numberRegex, cathedraTag.find('img').attr('onclick'));

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
          cathedraId,
        });
      });
  });

  return groupTeachers(data);
}
