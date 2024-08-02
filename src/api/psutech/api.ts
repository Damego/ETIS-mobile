import axios from 'axios';

import { ITeacher } from './types';

const BASE_URL = process.env.EXPO_PUBLIC_PSUTECH_API_URL;

const inst = axios.create({ baseURL: BASE_URL });

export const searchTeachers = async (query: string): Promise<ITeacher[]> => {
  const res = await inst.get(`/teachers/search`, {
    params: {
      query,
    },
  });
  return res.data;
};
