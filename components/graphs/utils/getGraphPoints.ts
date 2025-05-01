export const getGraphPoints = (points: any, yAxisKey: any, cutoff: number) => {
  const leftPoints = points[yAxisKey[0]].filter(
    (point: { xValue: number }) => (point.xValue! as number) <= cutoff
  );
  const rightPoints = points[yAxisKey[0]].filter(
    (point: { xValue: number }) => (point.xValue! as number) >= cutoff
  );

  const leftPoints2 = points[yAxisKey[1] || yAxisKey[0]].filter(
    (point: { xValue: number }) => (point.xValue! as number) <= cutoff
  );
  const rightPoints2 = points[yAxisKey[1] || yAxisKey[0]].filter(
    (point: { xValue: number }) => (point.xValue! as number) >= cutoff
  );

  return { leftPoints, rightPoints, leftPoints2, rightPoints2 };
};
