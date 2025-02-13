import {
  View,
  Text,
  Image,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import React, { useEffect, useState } from "react";
import { WeatherType } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";
import { Forecast, Location } from "@/app";
import DefaultText from "./DefaultText";
import RoundedTemperature from "./RoundedTemperature";

interface WeekForecastProps {
  forecast?: Forecast;
  location?: Location;
}

const HourlyForecast = ({ forecast, location }: WeekForecastProps) => {
  const [dailyArr, setDailyArr] = useState<DailyStats[]>([]);
  const [americanTime, setAmericanTime] = useState(true);

  type DailyStats = {
    time: string;
    celsius: string | number;
    condition: string;
    fullDate: string;
  };

  useEffect(() => {
    const now = new Date();
    const timeZone = location?.tz_id;
    const tzs = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      hour: "numeric",
      minute: "numeric",
    });
    const tmz = tzs.format(now);

    const currentHour = militaryHour(tmz);

    const timeFormat = (includeMinutes = true): Intl.DateTimeFormatOptions => ({
      hour: "numeric",
      minute: includeMinutes ? "numeric" : undefined, // Ternary operator
      hour12: americanTime,
    });

    function militaryHour(timeString: string) {
      if (timeString.includes("PM")) {
        // 24 hr
        return 12 + parseInt(timeString.split(":")[0]);
      }
      return parseInt(timeString.split(":")[0]);
    }

    function removeZeroFromTimeString(timeString: string) {
      if (timeString[0] === "0") {
        return timeString.slice(1);
      }
      return timeString;
    }

    function stringToDate(timeString: string) {
      const minutes = timeString.split(":")[1].split(" ")[0];
      const date = new Date();
      date.setHours(militaryHour(timeString));
      date.setMinutes(parseInt(minutes));
      return date.toLocaleTimeString("en-US", timeFormat());
    }

    function getHourlyForecast(lengthInDays: number) {
      let newArr: DailyStats[] = [];

      for (let i = 0; i < lengthInDays * 2; i++) {
        const sunriseTime = removeZeroFromTimeString(
          forecast?.forecastday[i].astro.sunrise!
        );
        const sunsetTime = removeZeroFromTimeString(
          forecast?.forecastday[i].astro.sunset!
        );

        const sunriseDate = stringToDate(sunriseTime);
        const sunsetDate = stringToDate(sunsetTime);

        forecast?.forecastday[i].hour.filter((hour, index) => {
          const firstIndex = i === 0;
          const greaterThanCurrentHour = index >= currentHour;

          const lastIndex = i === lengthInDays * 2 - 1;
          const lessThanCurrentHour = index <= currentHour;

          if (
            firstIndex
              ? greaterThanCurrentHour
              : lastIndex
              ? lessThanCurrentHour
              : false
          ) {
            newArr.push({
              time: removeZeroFromTimeString(
                new Date(hour.time).toLocaleTimeString(
                  "en-US",
                  timeFormat(false)
                )
              ),
              celsius: parseInt(hour.temp_c),
              condition: hour.condition.text,
              fullDate: hour.time,
            });
          }

          const sunriseGreaterThanCurrentHour =
            militaryHour(sunriseTime) >= currentHour;
          const sunriseLessThanCurrentHour =
            militaryHour(sunriseTime) <= currentHour;
          const sunriseIndex = index === militaryHour(sunriseTime);

          if (
            firstIndex && sunriseIndex
              ? sunriseGreaterThanCurrentHour
              : lastIndex && sunriseIndex
              ? sunriseLessThanCurrentHour
              : false
          ) {
            //Sunrise should be included
            newArr.push({
              time: removeZeroFromTimeString(sunriseDate),
              celsius: "sunrise",
              condition: "sunrise",
              // Used as key, add 'sunrise'/ 'sunset' in case time is same
              fullDate: "sunrise" + i,
            });
          }

          const sunsetGreaterThanCurrentHour =
            militaryHour(sunsetTime) >= currentHour;
          const sunsetLessThanCurrentHour =
            militaryHour(sunsetTime) <= currentHour;
          const sunsetIndex = index === militaryHour(sunsetTime);

          if (
            firstIndex && sunsetIndex
              ? sunsetGreaterThanCurrentHour
              : lastIndex && sunsetIndex
              ? sunsetLessThanCurrentHour
              : false
          ) {
            //Sunrise should be included
            newArr.push({
              time: removeZeroFromTimeString(sunsetDate),
              celsius: "sunset",
              condition: "sunset",
              fullDate: "sunset" + i,
            });
          }
        });
      }

      return newArr;
    }

    const newDailyArr = getHourlyForecast(1);
    setDailyArr(newDailyArr);
  }, []);

  return (
    <View
      className="mb-2 gap-y-3 rounded-xl pt-4 w-full px-4"
      style={{ backgroundColor: colors.bgWhite(0.15) }}
    >
      <View className="flex-row items-center ml-2">
        <DefaultText>Sunny conditions will continue all day</DefaultText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          borderTopWidth: 1,
          borderTopColor: colors.bgWhite(0.2),
        }}
      >
        {dailyArr.map((hour, index) => (
          <View
            key={hour?.fullDate}
            className="flex justify-center items-center w-fit rounded-3xl py-3 gap-y-2 "
          >
            <DefaultText className="font-semibold">
              {index === 0 ? "Now" : hour?.time.split(" ").join("")}
            </DefaultText>

            <Image
              source={
                weatherPNG(
                  (hour?.condition.toLowerCase() as WeatherType) ?? "Sunny"
                ) as ImageSourcePropType
              }
              className="h-11 w-11"
            />

            <RoundedTemperature
              temperature={hour?.celsius}
              className="text-2xl font-semibold"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HourlyForecast;
