import { load } from 'cheerio';



import { ITeacher, TeacherType } from '../models/teachers';
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
      cathedra = getTextField(teacherEl.find('.chair')),
      subject = getTextField(teacherEl.find('.dis')),
      [subjectUntyped, subjectType] = subject.trim().split('(');

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