export const calculateLimits = (firstWeek, currentWeek, lastWeek) => {
  const limits = 3;
  let leftLimit = currentWeek - limits;
  let rightLimit = currentWeek + limits;

  if (currentWeek - firstWeek <= limits) {
    leftLimit = firstWeek;
    rightLimit = firstWeek + limits * 2;
  }
  if (lastWeek - currentWeek <= limits) {
    rightLimit = lastWeek;
    leftLimit = lastWeek - limits * 2;
  }

  return { leftLimit, rightLimit };
};
