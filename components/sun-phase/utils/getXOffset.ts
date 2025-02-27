import { regularTimeOnXAxis } from "./getRegularTimeOnXAxis";

export function getXOffset(
  sunriseTime: string,
  xTicks: number,
  yShift: number
) {
  const sunriseTimeOnXAxis = regularTimeOnXAxis(sunriseTime);

  const firstIntersectionPreOffset =
    xTicks / 4 + (xTicks / 2 / Math.PI) * Math.asin(yShift / (xTicks / 2));

  const offset =
    firstIntersectionPreOffset - sunriseTimeOnXAxis * (xTicks / 24);
  return offset;
}
