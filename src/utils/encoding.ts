import iconv from 'iconv-lite';

export function encodeTextURI(data: string) {
  const buffer = iconv.encode(data, 'win1251');

  let URIString = '';
  buffer.forEach((i) => {
    const symbol = i.toString(16).toUpperCase();
    URIString += `%${symbol}`;
  });

  return URIString;
}

export function toURLSearchParams(obj: Record<string, unknown>) {
  const params: string[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    params.push(`${key}=${encodeTextURI(String(value ?? ''))}`);
  });

  return params.join('&');
}
