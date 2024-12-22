import axios from 'axios';

const BASE_URL = 'https://mapi.ijo42.ru/v2';

const inst = axios.create({ baseURL: BASE_URL });

export const isAudienceAvailable = async (audience: string, iCalToken: string) => {
  const res = await inst.get('/search', {
    params: {
      query_name: audience,
    },
    headers: {
      Authorization: iCalToken,
    },
  });

  return !!res.data.collection?.length;
};
