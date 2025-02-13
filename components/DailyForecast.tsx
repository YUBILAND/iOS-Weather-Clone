import {
  View,
  Text,
  Image,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import React, { useMemo, useRef } from "react";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { WeatherType } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";
import { Forecast, ForecastObject } from "@/app";
import DefaultText from "./DefaultText";
import RoundedTemperature from "./RoundedTemperature";
import ProgressBar from "./ProgressBar";

interface DailyForecastProps {
  forecast?: Forecast;
  getDate: (dateString: string) => string;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ forecast, getDate }) => {
  const shortDate = (date: string) => {
    return date.slice(0, 3);
  };

  const weekHighRef = useRef<number | null>(null);
  const weekLowRef = useRef<number | null>(null);

  type highOrLowProps = {
    high: string;
    low: string;
  };

  const getWeekHighandLow = useMemo(() => {
    const maxTempsArr = forecast?.forecastday.map((day) =>
      Math.round(parseInt(day.day.maxtemp_c))
    );
    const minTempsArr = forecast?.forecastday.map((day) =>
      Math.round(parseInt(day.day.mintemp_c))
    );
    weekHighRef.current = Math.max(...(maxTempsArr ?? []));
    weekLowRef.current = Math.min(...(minTempsArr ?? []));
  }, [forecast]);

  // console.log(weekHighRef.current);
  // console.log(weekLowRef.current);

  return (
    <View
      className="mb-2 gap-y-3 pt-4 rounded-xl"
      style={{ backgroundColor: colors.bgWhite(0.15) }}
    >
      <View className="flex-row items-center mx-5 gap-x-2 opacity-40">
        <CalendarDaysIcon size={22} color={"white"} />
        <DefaultText className="text-base uppercase font-semibold">
          10-Day Forecast
        </DefaultText>
      </View>

      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 15,
        }}
        style={{}}
        showsHorizontalScrollIndicator={false}
      >
        {forecast?.forecastday.map((item, index) => (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.bgWhite(0.2),
            }}
            key={item?.date}
            className="flex-row items-center w-full py-2 mr-4 gap-x-8"
          >
            <View
              className="flex-row justify-between items-center "
              style={{ flex: 40 }}
            >
              <DefaultText className="font-bold text-xl">
                {index === 0 ? "Today" : shortDate(getDate(item?.date))}
              </DefaultText>

              <Image
                source={
                  weatherPNG(
                    (item?.day.condition.text.toLowerCase() as WeatherType) ??
                      "Sunny"
                  ) as ImageSourcePropType
                }
                className="h-11 w-11"
              />
            </View>

            <View
              className="flex-row justify-center items-center gap-x-4"
              style={{ flex: 60 }}
            >
              <View className=" " style={{ flex: 20 }}>
                <RoundedTemperature
                  className="text-xl font-semibold "
                  temperature={parseInt(item?.day.mintemp_c)}
                  style={{ alignSelf: "flex-end", paddingRight: 5 }}
                />
              </View>

              <View style={{ flex: 50 }}>
                <ProgressBar
                  weekHigh={weekHighRef.current ?? undefined}
                  weekLow={weekLowRef.current ?? undefined}
                  dailyHigh={
                    Math.round(parseInt(item.day.maxtemp_c)) ?? undefined
                  }
                  dailyLow={
                    Math.round(parseInt(item.day.mintemp_c)) ?? undefined
                  }
                />
              </View>

              <View style={{ flex: 15 }}>
                <RoundedTemperature
                  className="text-xl font-semibold "
                  temperature={parseInt(item?.day.maxtemp_c)}
                  style={{ alignSelf: "flex-end" }}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default DailyForecast;
