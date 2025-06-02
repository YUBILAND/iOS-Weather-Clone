export const getStickyIndices = (arr: any) => {
  const stickyIndicesSpreadReverse = Array(arr.length)
    .fill(0)
    .map((_, index) => arr.length - 1 - index);
  const stickyArr = stickyIndicesSpreadReverse;
  return stickyArr;
};
