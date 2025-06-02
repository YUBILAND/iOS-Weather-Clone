import { averagePrecipExample, currentPrecipExample } from "./constants";

export const getLineData = () => {
  const blueLineArr = currentPrecipExample;
  const grayLineArr = averagePrecipExample;
  const currentBlueLineAverage = blueLineArr[blueLineArr.length - 1].average;
  const currentGrayLineAverage = grayLineArr[blueLineArr.length - 1].average;
  const rainSign = currentBlueLineAverage >= currentGrayLineAverage ? "+" : "-";
  const precipLineDiff = Math.abs(
    currentBlueLineAverage - currentGrayLineAverage
  ).toFixed(2);
  const lastAverageRainDifference = rainSign + precipLineDiff.toString() + '"';

  return {
    blueLineArr,
    currentBlueLineAverage,
    currentGrayLineAverage,
    lastAverageRainDifference,
  };
};
