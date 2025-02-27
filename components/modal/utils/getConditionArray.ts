import { WeatherData, weatherKey } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";

export const getConditionArray = (data: WeatherData, currentIndex: number) => {
  // Add midnight value
  const todaysForecast = data.forecast?.forecastday[currentIndex]?.hour;
  const addMidnightWeather = [
    ...todaysForecast,
    {
      condition: {
        text: todaysForecast[todaysForecast.length - 1].condition.text,
      },
      is_day: todaysForecast[todaysForecast.length - 1].is_day,
    },
  ];

  // Used in case of hacky dynamic image solution
  const conditionArray =
    data.forecast &&
    addMidnightWeather.map((hour) => {
      return weatherKey[weatherPNG(hour.condition.text, hour.is_day)];
    });
  return conditionArray;
};
