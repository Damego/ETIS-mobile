import { IFaculty } from '../models/faculty';
import cheerio from 'cheerio';

export const parseFaculties = (html: string): IFaculty[] => {
  const $ = cheerio.load(html);
  const data: IFaculty[] = [];
  $('div[class=span9] li').each(function()  {
    let href = $(this).children().attr('href');

    // cut to number only
    // ../stu.all_timetable?p_mode=1&p_fac_id=2277
    href = href.slice(href.search("p_fac_id=") + "p_fac_id=".length, href.length);

    data.push({
      name: $(this).text(),
      id: parseInt(href),
    });
  });

  return data;
}

export const parseFacultyCourses = (html: string, faculty: IFaculty): IFaculty => {
  const $ = cheerio.load(html);
  const courses: number[] = [];
  $('div[class=span9] li').each(function()  {
    courses.push(parseInt($(this).text()))
  });

  faculty.courses = courses;
  return faculty;
}
