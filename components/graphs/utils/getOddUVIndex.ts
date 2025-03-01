import { WeatherData } from "@/constants/constants";

export const getOddUVIndex = (data: WeatherData, currentIndex: number) => {
  const conditionArray =
    data.forecast &&
    data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
      return hour.uv;
    });

  const oddUVIndex = conditionArray.filter((uv, index) => {
    if (index % 2 === 1) {
      return uv.toString();
    }
  });
  // console.log(conditionArray);

  // console.log(oddUVIndex);

  return oddUVIndex;
};
