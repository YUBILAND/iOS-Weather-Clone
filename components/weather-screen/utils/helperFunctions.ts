export const getSumOfArray = (
  arr: number[],
  sumLength: number = arr.length - 1
) => {
  return arr.slice(0, sumLength).reduce((acc, val) => acc + val, 0);
};
