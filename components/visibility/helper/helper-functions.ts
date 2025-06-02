import {
  getGapArr,
  getTimeArr,
} from "@/components/graphs/utils/getGraphImageAndCoord";
import { Location } from "@/constants/constants";
import { getCurrentHour } from "@/hooks/hooks";

export const getVisImageArr = (visChunkArr: number[][], id: number) => {
  const timeArr = getTimeArr(12);
  const visImageArr = getGapArr(timeArr, visChunkArr[id]);
  return { timeArr, visImageArr };
};

export const getVisMessage = (vis: number) => {
  return vis > 10
    ? "Perfectly Clear"
    : vis > 5
    ? "Slightly Hazy"
    : vis > 2
    ? "Reduced Visibility"
    : vis > 1
    ? "Low Visibility"
    : "Very Poor Visibility";
};

export const getCurrentVis = (visChunkArr: number[][], location: Location) => {
  const currentVisChunkArr = visChunkArr[0];
  const currentGraphX = getCurrentHour(location?.tz_id);

  return currentVisChunkArr[currentGraphX];
};

export const chunkenArray = (arr: number[]) => {
  const chunkSize = 24;
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};
