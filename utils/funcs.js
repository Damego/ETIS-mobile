const calculateLimits = (firstPage, currentPage, lastPage) => {
  const limits = 3;
  if (lastPage - firstPage <= limits * 2) {
    return { leftLimit: firstPage, rightLimit: lastPage };
  }

  let leftLimit = currentPage - limits;
  let rightLimit = currentPage + limits;

  if (currentPage - firstPage <= limits) {
    leftLimit = firstPage;
    rightLimit = firstPage + limits * 2;
  }
  if (lastPage - currentPage <= limits) {
    rightLimit = lastPage;
    leftLimit = lastPage - limits * 2;
  }

  return { leftLimit, rightLimit };
};

export default calculateLimits;
