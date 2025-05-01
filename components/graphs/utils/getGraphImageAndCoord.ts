import { HourObject, WeatherData } from "@/constants/constants";

export const getGraphImageAndCoord = (
  data: WeatherData,
  currentIndex: number,
  imageCount: number,
  objectKey: keyof HourObject | "condition.code"
) => {
  const timeDistance = 24 / imageCount;
  const individualOffset = timeDistance / 2;

  let timeArr: number[] = [];

  let imageArr: string[] = [];

  for (let i = 0; i < imageCount; i++) {
    timeArr.push(individualOffset + i * timeDistance);
  }
  for (let i = 0; i < imageCount; i++) {
    const hourObject = data.forecast.forecastday[currentIndex].hour[timeArr[i]];

    const weatherDataItem =
      objectKey === "condition.code"
        ? hourObject.condition.code
        : hourObject[objectKey];
    imageArr.push(
      typeof weatherDataItem === "number"
        ? Math.round(weatherDataItem).toString()
        : weatherDataItem.toString()
    );
  }

  return { timeArr, imageArr };
};
