import { ICertificate } from '../models/ICertificate';
import { httpClient } from '../utils';

export const getCertificateHTML = async (certificate: ICertificate): Promise<string> => {
  const fetched = await httpClient.request(
    'GET',
    `/cert_pkg.stu_certif?p_creq_id=${certificate.id}&p_action=VIEW`,
    { returnResponse: false }
  );
  if (fetched.error) return;

  console.log('[DATA] fetched certificate html');

  return fetched.data;
};
