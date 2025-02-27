import { useMemo } from "react";
import { hourToWaveCoord } from "./hourtoWaveCoord";
import { regularTimeOnXAxis } from "./getRegularTimeOnXAxis";

export const useSunPhaseData = (
  xTicks: number,
  chordLength: number,
  currentTime: string,
  yShift: number,
  xOffset: number
) => {
  return useMemo(() => {
    const circleX = regularTimeOnXAxis(currentTime);
    const circleY =
      hourToWaveCoord(regularTimeOnXAxis(currentTime) * 60, xTicks, xOffset) -
      yShift;
    return Array.from({ length: xTicks + 1 }, (_, i) => ({
      hour: i * (24 / xTicks),
      sunPath: hourToWaveCoord(i, xTicks, xOffset) - yShift,
      sunPosition: i === circleX * 60 ? circleY : null,
      phaseLine: 0,
    }));
  }, [xTicks, chordLength, yShift]);
};
