import { getMinutesFromEpoch } from "./getMinutesFromEpoch";

export const getSliderTime = (
  sliderIndex: number,
  totalSteps: number,
  epochArr: number[] | null
) => {
  const currentHour = new Date().getHours();
  const offset = getMinutesFromEpoch(epochArr) ?? 0;
  const mins = (offset + 10 * sliderIndex) % 60;
  const hour = currentHour - Math.floor((totalSteps - sliderIndex - 1) / 6);
  const timeLabel = hour + ":" + (mins === 0 ? "00" : mins);
  // timeLabel === "0:00";
  return timeLabel;
};
