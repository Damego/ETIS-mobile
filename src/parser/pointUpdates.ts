import { executeRegex } from '../utils/sentry';

const lastPointDateRegex = /([0-9]{2}\.[0-9]{2}\.[0-9]{4}\s)/m;

export default function parsePointUpdates(data: string): string {
    if (data.length == 1) return null; 
    return executeRegex(lastPointDateRegex, data)[0];
}