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
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  const floorHourRef = useRef<number | null>(null);

  const [dailyArr, setDailyArr] = useState<DailyStats[]>([]);

  type DailyStats = {
    time: string;
    celsius: string;
    condition: string;
    date: string;
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

    let dailyArr: DailyStats[] = [];

    const showHourAndMeridiem: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      // minute: "numeric",
      hour12: true,
    };

    forecast?.forecastday[0].hour.filter((hour, index) => {
      if (index >= floorHour) {
        dailyArr.push({
          time: new Date(hour.time).toLocaleTimeString(
            "en-US",
            showHourAndMeridiem
          ),
          celsius: hour.temp_c,
          condition: hour.condition.text,
          date: hour.time,
        });
      }
    });

    forecast?.forecastday[1].hour.filter((hour, index) => {
      if (index <= floorHour) {
        dailyArr.push({
          time: new Date(hour.time).toLocaleTimeString(
            "en-US",
            showHourAndMeridiem
          ),
          celsius: hour.temp_c,
          condition: hour.condition.text,
          date: hour.time,
        });
      }
    });

    // console.log(dailyArr);

    setDailyArr(dailyArr);
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
            key={hour?.date}
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
              className="h-11 w-11 "
            />

            <RoundedTemperature
              temperatureString={hour?.celsius}
              className="text-2xl font-semibold"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HourlyForecast;
