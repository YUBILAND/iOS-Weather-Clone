import { weatherImages, WeatherType } from "@/constants/constants";

type Forecast = {
  date: string;
  day: string;
  temperature: number;
  weather: WeatherType;
};

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

const days: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// export const weekForecast: Forecast[] = [
//   {
//     date: "2024-02-03",
//     day: days[new Date("2024-02-03").getDay()],
//     temperature: 13,
//     weather: "Partly cloudy".toLowerCase(),
//   },
//   {
//     date: "2024-02-04",
//     day: days[new Date("2024-02-04").getDay()],
//     temperature: 20,
//     weather: "Clear",
//   },
//   {
//     date: "2024-02-06",
//     day: days[new Date("2024-02-06").getDay()],
//     temperature: 16,
//     weather: "Light rain",
//   },
//   {
//     date: "2024-02-07",
//     day: days[new Date("2024-02-07").getDay()],
//     temperature: 12,
//     weather: "Overcast",
//   },
//   {
//     date: "2024-02-08",
//     day: days[new Date("2024-02-08").getDay()],
//     temperature: 22,
//     weather: "Clear",
//   },
//   {
//     date: "2024-02-09",
//     day: days[new Date("2024-02-09").getDay()],
//     temperature: 19,
//     weather: "Cloudy",
//   },
// ];
