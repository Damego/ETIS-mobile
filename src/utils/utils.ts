export const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

export const partitionItems = <T>(array: T[], callback: (item: T) => boolean): T[][] =>
  array.reduce(
    ([group1, group2], item) =>
      callback(item) ? [[...group1, item], group2] : [group1, [...group2, item]],
    [[], []]
  );

type GroupT<T> = { [s: string]: T[] };

export const groupItems = <T>(array: T[], keyExtractor: (item: T) => string) => {
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
