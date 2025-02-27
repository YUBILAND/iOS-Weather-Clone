export const hourToWaveCoord = (x: number, xTicks: number, xOffset: number) => {
  //  get the sine wave coordinates for each hour x
  return (
    (xTicks / 2) *
    Math.sin((x - xTicks / 4 + xOffset) * (Math.PI / (xTicks / 2)))
  );
};
