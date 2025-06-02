import { HourObject, WeatherData } from "@/constants/constants";

export const getGraphImageAndCoord = (
  data: WeatherData,
  currentIndex: number,
  imageCount: number,
  objectKey: keyof HourObject | "condition.code"
) => {
  // For imageCount 12 it produces [1,3,5,7,..]
  const timeArr: number[] = getTimeArr(imageCount);

  let imageArr: string[] = [];

  const dataHour = data.forecast.forecastday[currentIndex].hour;

  const wantWeatherCode = objectKey === "condition.code";

  for (let i = 0; i < imageCount; i++) {
    const hourObject = dataHour[timeArr[i]];

    const weatherDataItem = wantWeatherCode
      ? hourObject.condition.code
      : hourObject[objectKey];

    const isWeatherCode = typeof weatherDataItem === "number";

    imageArr.push(
      isWeatherCode
        ? Math.round(weatherDataItem).toString()
        : weatherDataItem.toString()
    );
  }

  return { timeArr, imageArr };
};

export const getTimeArr = (imageCount: number) => {
  const timeGap = 24 / imageCount;
  const individualOffset = timeGap / 2;

  let timeArr: number[] = [];
  for (let i = 0; i < imageCount; i++) {
    timeArr.push(individualOffset + i * timeGap);
  }

  return timeArr;
};

export const getGapArr = (timeArr: number[], arr: number[]) => {
  return timeArr
    .filter((val) => arr[val])
    .map((val) => Math.round(arr[val]).toString());
};
