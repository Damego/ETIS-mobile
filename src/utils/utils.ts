export const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Non-crypto unique id (Math.random based) — enough for local task/notification ids
export const generateId = (): string =>
  Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 10)).join('');

export const partitionItems = <T>(array: T[], callback: (item: T) => boolean): [T[], T[]] =>
  array.reduce(
    ([group1, group2], item) =>
      callback(item) ? [[...group1, item], group2] : [group1, [...group2, item]],
    [[] as T[], [] as T[]]
  );

type GroupT<T> = { [s: string]: T[] };

export const groupItems = <T>(array: T[] | undefined | null, keyExtractor: (item: T) => string) => {
  if (!Array.isArray(array) || array.length === 0) return [] as T[][];

  const grouped: GroupT<T> = {} as GroupT<T>;
  array.forEach((item) => {
    const key = keyExtractor(item);
    let group = grouped[key];
    if (group) group.push(item);
    else group = [item];

    grouped[key] = group;
  });

  return Object.values<T[]>(grouped);
};
