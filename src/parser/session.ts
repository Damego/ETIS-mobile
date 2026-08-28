import type { CheerioAPI } from 'cheerio';

import { ISession } from '../models/session';
import { getTextField } from './utils';

export default function parseSessionData($: CheerioAPI): ISession {
  const data: ISession = {
    current: 0,
    latest: 0,
    name: '',
  };

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
