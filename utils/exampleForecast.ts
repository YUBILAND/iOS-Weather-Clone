import { weatherImages, WeatherType } from "@/constants/constants";

export const getWeatherImage = (weatherCondition: string) => {
  for (const [imagePath, conditions] of Object.entries(weatherImages)) {
    if (conditions.includes(weatherCondition)) {
      return imagePath;
    }
  }
  return undefined; // Fallback image
};

export const weatherPNG = (weatherName: WeatherType) => {
  // remove trailing white space
  let weatherNameNoWhiteSpace: WeatherType = weatherName
    .split(" ")
    .filter((x) => x)
    .join(" ") as WeatherType;
  // console.log(weatherName);

  return getWeatherImage(weatherNameNoWhiteSpace);
};
