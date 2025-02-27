export const getYShift = (chordLength: number, xTicks: number) => {
  const yShift = (xTicks / 2) * Math.sin((Math.PI / 24) * (12 - chordLength));
  return yShift;
};
