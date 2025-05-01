export const getSunGraphPoint = (
  points: any,
  firstIntersectionPostOffset: number,
  secondIntersectionPostOffset: number,
  xTicks: number
) => {
  const nightTime1 = points.sunPath.filter(
    (point: { xValue: number }) =>
      (point.xValue! as number) <= firstIntersectionPostOffset / (xTicks / 24)
  );
  const dayTime = points.sunPath.filter(
    (point: { xValue: number }) =>
      (point.xValue! as number) >=
        firstIntersectionPostOffset / (xTicks / 24) &&
      (point.xValue! as number) <= secondIntersectionPostOffset / (xTicks / 24)
  );
  const nightTime2 = points.sunPath.filter(
    (point: { xValue: number }) =>
      (point.xValue! as number) >= secondIntersectionPostOffset / (xTicks / 24)
  );

  return { nightTime1, dayTime, nightTime2 };
};
