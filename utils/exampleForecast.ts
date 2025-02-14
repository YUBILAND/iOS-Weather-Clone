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
  // console.log('"' + weatherName + '"');

  let weatherNameNoWhiteSpace: WeatherType = weatherName
    .split(" ")
    .filter((x) => x)
    .join(" ") as WeatherType;
  // console.log('"' + weatherNameNoWhiteSpace + '"');
  return getWeatherImage(weatherNameNoWhiteSpace);
};

export const days: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
