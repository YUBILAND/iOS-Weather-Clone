import { weatherImages, WeatherType } from "@/constants/constants";

export const getWeatherImage = (weatherCondition: string) => {
  for (const [imagePath, conditions] of Object.entries(weatherImages)) {
    if (conditions.includes(weatherCondition)) {
      return imagePath;
    }
  }
  return "clear"; // Fallback image
};

export const weatherPNG = (
  weatherName: WeatherType,
  is_day: boolean = true
) => {
  // remove trailing white space
  // console.log('"' + weatherName + '"');

  let weatherNameNoWhiteSpace: WeatherType = weatherName
    .toLowerCase()
    .split(" ")
    .filter((x) => x) // removes whitespace
    .join(" ") as WeatherType;
  // console.log('"' + weatherNameNoWhiteSpace + '"');

  if (is_day) {
    return getWeatherImage(weatherNameNoWhiteSpace);
  } else {
    return getWeatherImage(weatherNameNoWhiteSpace + " night");
  }
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
