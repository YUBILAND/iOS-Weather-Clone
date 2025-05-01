export const getMinMaxArr = (arr: number[]) => {
  const arrMax = Math.max(...arr);
  const arrMin = Math.min(...arr);

  return { arrMax, arrMin };
};
