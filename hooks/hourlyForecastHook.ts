import { WeatherData } from "@/constants/constants";
import {
  getCurrentHour,
  militaryHour,
  removeZeroFromTimeString,
  stringToTime,
  timeFormat,
} from "./hooks";

export function dateStringToTime(
  dateString: string,
  removeMinutes: boolean,
  americanTime: boolean
) {
  return removeZeroFromTimeString(
    new Date(dateString).toLocaleTimeString(
      "en-US",
      timeFormat(americanTime, removeMinutes)
    )
  );
}

export function addWhiteSpace(weatherString: string) {
  if (weatherString[weatherString.length - 1] !== " ") {
    return weatherString + " ";
  }
  return weatherString;
}

type DailyStats = {
  time: string;
  celsius: string | number;
  condition: string;
  fullDate: string;
};

export const getHourlyForecastResult = (
  data: WeatherData,
  americanTime: boolean
) => {
  if (data.location) {
    const currentHour = getCurrentHour(data.location!.tz_id);

    function getHourlyForecast(lengthInDays: number) {
      let newArr: DailyStats[] = [];

      for (let i = 0; i <= lengthInDays; i++) {
        const sunriseTime = removeZeroFromTimeString(
          data.forecast?.forecastday[i].astro.sunrise!
        );
        const sunsetTime = removeZeroFromTimeString(
          data.forecast?.forecastday[i].astro.sunset!
        );

        const sunriseDate = stringToTime(americanTime, sunriseTime, false);
        const sunsetDate = stringToTime(americanTime, sunsetTime, false);

        data.forecast?.forecastday[i].hour.filter((hour, index) => {
          const firstIndex = i === 0;
          const greaterThanCurrentHour = index >= currentHour;

          const lastIndex = i === lengthInDays * 2 - 1;
          const lessThanCurrentHour = index <= currentHour;

          // Insert hourly info
          if (
            (firstIndex && greaterThanCurrentHour) ||
            (lastIndex && lessThanCurrentHour)
          ) {
            const normalTime = dateStringToTime(hour.time, true, americanTime);
            const celsius = parseInt(hour.temp_c);
            const condition = hour?.is_day
              ? hour.condition.text
              : addWhiteSpace(hour.condition.text) + "night";
            newArr.push({
              time: normalTime,
              condition: condition,

              celsius: celsius,
              fullDate: hour.time,
            });
          }

          // Insert Sunrise Time
          const sunriseGreaterThanCurrentHour =
            militaryHour(sunriseTime) >= currentHour;
          const sunriseLessThanCurrentHour =
            militaryHour(sunriseTime) <= currentHour;
          const sunriseIndex = index === militaryHour(sunriseTime);

          if (
            (firstIndex && sunriseIndex && sunriseGreaterThanCurrentHour) ||
            (lastIndex && sunriseIndex && sunriseLessThanCurrentHour)
          ) {
            //Sunrise should be included

            const sunriseExactTime = removeZeroFromTimeString(sunriseDate);
            const sunriseText = "sunrise";

            newArr.push({
              time: sunriseExactTime,
              condition: "sunrise",
              celsius: sunriseText,
              // Used as key, add 'sunrise'/ 'sunset' in case time is same
              fullDate: "sunrise" + i,
            });
          }

          // Insert Sunset Time
          const sunsetGreaterThanCurrentHour =
            militaryHour(sunsetTime) >= currentHour;
          const sunsetLessThanCurrentHour =
            militaryHour(sunsetTime) <= currentHour;
          const sunsetIndex = index === militaryHour(sunsetTime);

          if (
            (firstIndex && sunsetIndex && sunsetGreaterThanCurrentHour) ||
            (lastIndex && sunsetIndex && sunsetLessThanCurrentHour)
          ) {
            //Sunrise should be included
            const sunsetExactTime = removeZeroFromTimeString(sunsetDate);
            const sunsetText = "sunrise";

            newArr.push({
              time: sunsetExactTime,
              condition: "sunset",
              celsius: sunsetText,
              fullDate: "sunset" + i,
            });
          }
        });
      }
      return newArr;
    }

    const newDailyArr = getHourlyForecast(1);
    return newDailyArr;
  }
  return [];
};
