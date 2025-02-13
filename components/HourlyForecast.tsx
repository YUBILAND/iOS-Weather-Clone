import {
  View,
  Text,
  Image,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { WeatherType } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";
import { Forecast } from "@/app";
import DefaultText from "./DefaultText";
import RoundedTemperature from "./RoundedTemperature";

interface WeekForecastProps {
  forecast?: Forecast;
  getDate: (dateString: string) => string;
}

const HourlyForecast = ({ forecast, getDate }: WeekForecastProps) => {
  const floorHourRef = useRef<number | null>(null);

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
    // const options: Intl.DateTimeFormatOptions = {
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: false, // Use 24-hour format
    // };
    // const localTime = now.toLocaleTimeString("en-US", options);
    // console.log("local Time is ", localTime);

    const floorHour = now.getHours();

    // const gmtTime = now.getTimezoneOffset() / 60; //ETC offset would be 5 hours behind GMT
    // const localTime = Date.now() - gmtTime * 60 * 60 * 1000;
    // console.log(new Date(localTime));

    // setCurrentTime(localTime);

    floorHourRef.current = floorHour;
    // console.log(floorHour);

    let currentDayArr: DailyStats[] = [];
    let nextDayArr: DailyStats[] = [];

    type whichDay = "current" | "next";

    const addSuntoArr = (arr: DailyStats[], day: whichDay) => {
      if (day === "current") {
        forecast?.forecastday[0].astro.sunrise;
        forecast?.forecastday[0].astro.sunset;
      }
    };

    const showHourAndMeridiem: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      // minute: "numeric",
      hour12: americanTime,
    };

    function changeTo24(timeString: string) {
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

    // Sun movements on current day
    const currentDaySunriseTime = removeZeroFromTimeString(
      forecast?.forecastday[0].astro.sunrise!
    );
    const currentDaySunriseHour = parseInt(
      currentDaySunriseTime.split(":")[0]!
    );
    const currentDaySunsetTime = removeZeroFromTimeString(
      forecast?.forecastday[0].astro.sunset!
    );
    const currentDaySunsetHour = parseInt(currentDaySunsetTime.split(":")[0]);

    forecast?.forecastday[0].hour.filter((hour, index) => {
      if (index >= floorHour) {
        currentDayArr.push({
          time: new Date(hour.time).toLocaleTimeString(
            "en-US",
            showHourAndMeridiem
          ),
          celsius: parseInt(hour.temp_c),
          condition: hour.condition.text,
          fullDate: hour.time,
          // date: new Date(hour.time).getDate().toString(),
        });
      }

      if (
        currentDaySunriseHour >= floorHour &&
        index === changeTo24(currentDaySunriseTime)
      ) {
        //Sunrise should be included
        currentDayArr.push({
          time: currentDaySunriseTime,
          celsius: "sunrise",
          condition: "sunrise",
          // Used as key, add 'sunrise'/ 'sunset' in case time is same
          fullDate: "sunrise" + currentDaySunriseTime,
        });

        if (
          currentDaySunsetHour >= floorHour &&
          index === changeTo24(currentDaySunsetTime)
        ) {
          //Sunrise should be included
          currentDayArr.push({
            time: currentDaySunsetTime,
            celsius: "sunset",
            condition: "sunset",
            fullDate: "sunset" + currentDaySunsetTime,
          });
        }
      }
    });

    // Sun movements on next day
    const nextDaySunriseTime = removeZeroFromTimeString(
      forecast?.forecastday[1].astro.sunrise!
    );
    const nextDaySunriseHour = parseInt(nextDaySunriseTime.split(":")[0]);
    const nextDaySunsetTime = removeZeroFromTimeString(
      forecast?.forecastday[1].astro.sunset!
    );
    const nextDaySunsetHour = parseInt(nextDaySunsetTime.split(":")[0]);

    forecast?.forecastday[1].hour.filter((hour, index) => {
      if (index <= floorHour) {
        nextDayArr.push({
          time: new Date(hour.time).toLocaleTimeString(
            "en-US",
            showHourAndMeridiem
          ),
          celsius: parseInt(hour.temp_c),
          condition: hour.condition.text,
          fullDate: hour.time,
        });
      }

      if (
        nextDaySunriseHour <= floorHour &&
        index === changeTo24(nextDaySunriseTime)
      ) {
        //Sunrise should be included
        nextDayArr.push({
          time: nextDaySunriseTime,
          celsius: "sunrise",
          condition: "sunrise",
          fullDate: "sunrise" + nextDaySunriseTime,
        });
      }

      if (
        nextDaySunsetHour <= floorHour &&
        index === changeTo24(nextDaySunsetTime)
      ) {
        //Sunrise should be included
        nextDayArr.push({
          time: nextDaySunsetTime,
          celsius: "sunset",
          condition: "sunset",
          fullDate: "sunset" + nextDaySunsetTime,
        });
      }
    });

    const localDailyArr = [...currentDayArr, ...nextDayArr];
    setDailyArr(localDailyArr);
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
