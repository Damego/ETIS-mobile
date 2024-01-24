import { load } from 'cheerio';

export default function parseAnnounce(html: string): string[] | null {
  const $ = load(html);

  const data: string[] = [];

  // Let WebView work with this shit
  $('.span9')
    .children()
    .filter('ul')
    .each((_index, el) => {
      // source code is fucked up. WebView is fucked up (it always throws an error if link tag doesn't have a target)
      // So why my code can't be fucked up?
      const messageHtml = $(el)
        .html()
        .replaceAll('<a', `<a target="_blank"`)
        .replaceAll(`href="df_pkg.`, `href="https://student.psu.ru/pls/stu_cus_et/df_pkg.`)
        .replaceAll(
          `<a target="_blank" target="_blank" href="https://student.psu.ru/pls/stu_cus_et/df_pkg.`,
          `<a href="https://student.psu.ru/pls/stu_cus_et/df_pkg.`
        );
      data.push(messageHtml);
    });

  return data;
}
