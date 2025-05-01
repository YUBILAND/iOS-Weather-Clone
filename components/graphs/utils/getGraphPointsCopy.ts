export const getGraphPointsCopy = (points: any, value: any, cutoff: number) => {
  const leftPoints = points[value].filter(
    (point: { xValue: number }) => (point.xValue! as number) <= cutoff
  );
  const rightPoints = points[value].filter(
    (point: { xValue: number }) => (point.xValue! as number) >= cutoff
  );

  const leftPoints2 = points[value].filter(
    (point: { xValue: number }) => (point.xValue! as number) <= cutoff
  );
  const rightPoints2 = points[value].filter(
    (point: { xValue: number }) => (point.xValue! as number) >= cutoff
  );

  return { leftPoints, rightPoints, leftPoints2, rightPoints2 };
};
