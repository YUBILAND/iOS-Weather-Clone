import { View, Image, ScrollView, ImageSourcePropType } from "react-native";
import React, { useMemo, useRef } from "react";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { weatherKey, WeatherType } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import RoundedTemperature from "../atoms/RoundedTemperature";
import ProgressBar from "../atoms/ProgressBar";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import OpacityCard from "../atoms/OpacityCard";

interface DailyForecastProps {
  cityName: string;
  getDate: (dateString: string) => string;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ cityName, getDate }) => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const shortDate = (date: string) => {
    return date.slice(0, 3);
  };

  const weekHighRef = useRef<number | null>(null);
  const weekLowRef = useRef<number | null>(null);
  //   high: string;
  //   low: string;
  // };

  if (!cityName) {
    return;
  }

  const { forecast, current } = data[cityName];

  // THIS IS NECESSARY FOR INSTANT REF UPDATE FOR PROGRESS BAR
  const getWeekHighandLow = useMemo(() => {
    const maxTempsArr = forecast?.forecastday.map((day) =>
      Math.round(parseInt(day.day.maxtemp_c))
    );
    const minTempsArr = forecast?.forecastday.map((day) =>
      Math.round(parseInt(day.day.mintemp_c))
    );
    weekHighRef.current = Math.max(...(maxTempsArr ?? []));
    weekLowRef.current = Math.min(
      ...(minTempsArr ?? []),
      parseInt(current?.temp_c)
    );
  }, [forecast]);

  return (
    <OpacityCard>
      <View className="flex-row items-center mx-5 gap-x-2 opacity-40 mb-2">
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
            {/* Day + Weather Image */}
            <View
              className="flex-row justify-between items-center "
              style={{ flex: 40 }}
            >
              <DefaultText className="font-bold text-xl">
                {index === 0
                  ? "Today"
                  : shortDate(getDate(item?.date + "T00:00:00"))}
              </DefaultText>

              <Image
                source={
                  weatherKey[
                    weatherPNG(
                      item?.day.condition.text.toLowerCase() as WeatherType
                    )
                  ]
                }
                className="h-11 w-11"
              />
            </View>

            {/* High and Low + Progress Bar */}
            <View
              className="flex-row justify-center items-center gap-x-4"
              style={{ flex: 60 }}
            >
              {/* Daily Low */}
              <View className=" " style={{ flex: 25 }}>
                <RoundedTemperature
                  className="text-xl font-semibold "
                  temperature={parseInt(item?.day.mintemp_c)}
                  style={{ alignSelf: "flex-end", paddingRight: 5 }}
                />
              </View>

              {/* Temperature Bar */}
              <View style={{ flex: 50 }}>
                <ProgressBar
                  weekHigh={weekHighRef.current ?? undefined}
                  weekLow={weekLowRef.current ?? undefined}
                  dailyHigh={parseInt(item.day.maxtemp_c) ?? undefined}
                  dailyLow={parseInt(item.day.mintemp_c) ?? undefined}
                  currentTemperature={parseInt(current?.temp_c!)}
                  index={index}
                />
              </View>

              {/* Daily High */}
              <View style={{ flex: 20 }}>
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
    </OpacityCard>
  );
};

export default DailyForecast;
