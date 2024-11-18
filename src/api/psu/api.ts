import axios from 'axios';
import { ITeacherContacts } from '~/api/psu/models';
import { parseTeacherContacts } from '~/api/psu/parser';

export const getTeacherContacts = async (teacherPageUrl: string) => {
  const res = await axios.get<string>(teacherPageUrl);
  return parseTeacherContacts(res.data);
};
