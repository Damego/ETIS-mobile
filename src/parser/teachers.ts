import { load } from 'cheerio';

import { ITeacher, ITeacherSubject } from '../models/teachers';
import { executeRegex } from '../utils/sentry';
import { disciplineRegex, numberRegex } from './regex';
import { getDisciplineType, getTextField } from './utils';

export default function parseTeachers(html: string): ITeacher[] {
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

    const subjects: ITeacherSubject[] = [];
    getTextField(teacherEl.find('.dis'))
      .split('\n')
      .forEach((subject) => {
        const [, discipline, typesString] = executeRegex(disciplineRegex, subject);
        const types = typesString
          ? typesString.split(',').map((s) => getDisciplineType(s.trim()))
          : [];
        subjects.push({ discipline, types });
      });

    data.push({
      id,
      photo,
      name,
      cathedra,
      subjects,
      photoTitle,
      cathedraId,
    });
  });

  return data;
}
