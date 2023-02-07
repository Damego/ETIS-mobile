export const calculateLimits = (firstWeek, currentWeek, lastWeek) => {
  const limits = 3;
  let leftLimit = currentWeek - limits;
  let rightLimit = currentWeek + limits;

  if (leftLimit < firstWeek) {
    rightLimit += currentWeek - leftLimit;
    leftLimit = firstWeek;
  }
  if (rightLimit > lastWeek) {
    leftLimit -= rightLimit - lastWeek;
    rightLimit = lastWeek;
  }

  return { leftLimit, rightLimit };
};