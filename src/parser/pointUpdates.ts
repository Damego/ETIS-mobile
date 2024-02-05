import { executeRegex } from '../utils/sentry';

const lastPointDateRegex = /([0-9]{2}\.[0-9]{2}\.[0-9]{4} )/m;

export default function parsePointUpdates(xhr: string): string {
    // когда дат изменения нет, запрос возвращает один пробел (но это не точно)
    if (xhr == "" || xhr.length < 10) return "empty"; 
    return executeRegex(lastPointDateRegex, xhr)[0];
}