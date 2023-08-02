import { getTextField } from './utils';
import { ISession } from '../models/session';

export default function parseSessionData($: cheerio.Root): ISession {
  const data: ISession = {};

  const subMenu = $('.submenu').last();
  $('.submenu-item', subMenu).each((i, el) => {
    if (!getTextField($('a', el))) {
      data.current = i + 1;
      return false;
    }
  });
  const latestSession = $('.submenu-item', subMenu).last();
  data.latest = latestSession.index() + 1;
  data.name = getTextField(latestSession).split(' ').at(-1);

  return data;
}