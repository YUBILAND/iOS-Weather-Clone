export const getDaysSincePrevFullMoon = () => {
  // last full moon was 2/12/2025, month is zero indexed so 2 should be 1
  const lastFullMoon = new Date(Date.UTC(2025, 1, 12));
  const ms = lastFullMoon.getTime() - new Date().getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  const dayDifference = Math.abs(Math.floor(ms / msPerDay));

  return dayDifference;
};
