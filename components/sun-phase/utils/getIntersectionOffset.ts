export const getFirstIntersectionPostOffset = (
  xTicks: number,
  xOffset: number,
  yShift: number
) =>
  xTicks / 4 -
  xOffset +
  (xTicks / 2 / Math.PI) * Math.asin(yShift / (xTicks / 2));

export const getSecondIntersectionPostOffset = (
  xTicks: number,
  xOffset: number,
  yShift: number
) =>
  (3 * xTicks) / 4 -
  xOffset -
  (xTicks / 2 / Math.PI) * Math.asin(yShift / (xTicks / 2));
