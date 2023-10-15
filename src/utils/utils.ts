export const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
