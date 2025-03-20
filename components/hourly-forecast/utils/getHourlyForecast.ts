import { WeatherData, WeatherType } from "@/constants/constants";
import {
  getCurrentHour,
  getCurrentTime,
  militaryHour,
  removeZeroFromTimeString,
  stringToTime,
} from "@/hooks/hooks";
import { DailyStats } from "./constants";
import { addWhiteSpace, dateStringToTime } from "@/hooks/hourlyConstants";

export const getHourlyForecastObject = (
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
          const firstDay = i === 0;
          const greaterThanCurrentHour = index >= currentHour;

          const lastDay = i === lengthInDays * 2 - 1;
          const lessThanCurrentHour = index <= currentHour;

          // Insert hourly info
          if (
            (firstDay && greaterThanCurrentHour) ||
            (lastDay && lessThanCurrentHour)
          ) {
            const normalTime = dateStringToTime(hour.time, true, americanTime);
            const celsius = parseInt(hour.temp_c);
            const condition =
              hour.wind_mph >= 15
                ? ("windy" as WeatherType)
                : hour?.is_day
                ? hour.condition.text
                : addWhiteSpace(hour.condition.text) + "night";
            newArr.push({
              time: normalTime,
              condition: condition,
              celsius: celsius,
              fullDate: hour.time,
              code: hour.condition.code,
              is_day: hour?.is_day,
              chance_of_rain: hour?.chance_of_rain,
            });
          }

          // Insert Sunrise Time

          const sunriseGreaterThanCurrentTime =
            militaryHour(sunriseTime) > currentHour &&
            parseInt(sunriseTime.split(":")[1].split(" ")[0]) >=
              new Date().getUTCMinutes();

          const sunriseLessThanCurrentHour =
            militaryHour(sunriseTime) <= currentHour;
          const sunriseIndex = index === militaryHour(sunriseTime);

          const sunriseOnFirstDay =
            firstDay && sunriseIndex && sunriseGreaterThanCurrentTime;
          const sunriseOnLastDay =
            lastDay && sunriseIndex && sunriseLessThanCurrentHour;

          if (sunriseOnFirstDay || sunriseOnLastDay) {
            //Sunrise should be included

            const sunriseExactTime = removeZeroFromTimeString(sunriseDate);
            const sunriseText = "sunrise";

            newArr.push({
              time: sunriseExactTime,
              condition: "sunrise",
              celsius: sunriseText,
              // Used as key, add 'sunrise'/ 'sunset' in case time is same
              fullDate: "sunrise" + i,
              code: 1,
              is_day: hour?.is_day,
            });
          }

          // Insert Sunset Time

          const sunsetGreaterThanCurrentTime =
            militaryHour(sunsetTime) >= currentHour;
          const sunsetLessThanCurrentHour =
            militaryHour(sunsetTime) <= currentHour;
          const sunsetIndex = index === militaryHour(sunsetTime);

          if (
            (firstDay && sunsetIndex && sunsetGreaterThanCurrentTime) ||
            (lastDay && sunsetIndex && sunsetLessThanCurrentHour)
          ) {
            //Sunrise should be included
            const sunsetExactTime = removeZeroFromTimeString(sunsetDate);
            const sunsetText = "sunset";

            newArr.push({
              time: sunsetExactTime,
              condition: "sunset",
              celsius: sunsetText,
              fullDate: "sunset" + i,
              code: 0,
              is_day: hour?.is_day,
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
