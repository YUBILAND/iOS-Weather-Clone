import { convertWindUnits } from "@/components/wind-forecast/utils/convertWindUnits";
import { HourObject, WeatherData } from "@/constants/constants";
import {
  getDistance,
  getPrecipitation,
  getPressure,
  getTemperature,
} from "@/hooks/useDisplayUnits";
import { useOtherUnits } from "@/hooks/useOtherUnits";

// For Graph Data

const getWindForecast = (data: WeatherData, currentIndex: number) => {
  const windUnits = useOtherUnits()["wind"];

  return data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
    return {
      ...hour, // Spread the other keys of the hour object
      wind_mph:
        windUnits === "bft"
          ? Math.round(convertWindUnits(hour.wind_mph, windUnits))
          : convertWindUnits(hour.wind_mph, windUnits),
      gust_mph:
        windUnits === "bft"
          ? Math.round(convertWindUnits(hour.gust_mph, windUnits))
          : convertWindUnits(hour.gust_mph, windUnits),
    };
  });
};

const getTempForecast = (data: WeatherData, currentIndex: number) => {
  return data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
    return {
      ...hour, // Spread the other keys of the hour object
      temp_c: getTemperature(hour.temp_c),
    };
  });
};

const getFeelsLikeForecast = (data: WeatherData, currentIndex: number) => {
  return data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
    return {
      ...hour, // Spread the other keys of the hour object
      windchill_c: getTemperature(hour.windchill_c),
    };
  });
};

const getPrecipForecast = (data: WeatherData, currentIndex: number) => {
  return data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
    return {
      ...hour, // Spread the other keys of the hour object
      precip_in: getPrecipitation(hour.precip_in),
    };
  });
};

const getVisForecast = (data: WeatherData, currentIndex: number) => {
  return data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
    return {
      ...hour, // Spread the other keys of the hour object
      vis_miles: getDistance(hour.vis_miles),
    };
  });
};

const getPressureForecast = (data: WeatherData, currentIndex: number) => {
  return data.forecast?.forecastday[currentIndex]?.hour.map((hour) => {
    return {
      ...hour, // Spread the other keys of the hour object
      pressure_in: getPressure(hour.pressure_in),
    };
  });
};

const addMidnightWeather = (
  todaysForecast: HourObject[],
  objectKey: (keyof HourObject)[]
) => {
  return [
    ...todaysForecast,
    {
      [objectKey[0] as string]:
        todaysForecast[todaysForecast.length - 1][objectKey[0]],
      ...(objectKey[1]
        ? {
            [objectKey[1] as string]:
              todaysForecast[todaysForecast.length - 1][objectKey[1]],
          }
        : {}),
    },
  ];
};

export const getTodaysForecast = (
  data: WeatherData,
  objectKey: (keyof HourObject)[],
  currentIndex: number
) => {
  const todaysForecast =
    objectKey[0] === "wind_mph"
      ? getWindForecast(data, currentIndex)
      : objectKey[0] === "temp_c"
      ? getTempForecast(data, currentIndex)
      : objectKey[0] === "windchill_c"
      ? getFeelsLikeForecast(data, currentIndex)
      : objectKey[0] === "precip_in"
      ? getPrecipForecast(data, currentIndex)
      : objectKey[0] === "vis_miles"
      ? getVisForecast(data, currentIndex)
      : objectKey[0] === "pressure_in"
      ? getPressureForecast(data, currentIndex)
      : data.forecast?.forecastday[currentIndex]?.hour;

  // Fill in missing 24:00 or 0:00 time. Just a copy of 23:00 data
  const addMidnight = addMidnightWeather(todaysForecast, objectKey);

  return addMidnight;
};
