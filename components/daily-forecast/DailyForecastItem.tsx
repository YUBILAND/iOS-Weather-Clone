import { colors } from "@/assets/colors/colors";
import {
  ForecastObject,
  WeatherData,
  weatherKey,
  WeatherType,
} from "@/constants/constants";
import { getDate } from "@/hooks/hooks";
import { weatherPNG } from "@/utils/exampleForecast";
import React from "react";
import { Image, Pressable, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import RoundedTemperature from "../atoms/RoundedTemperature";
import ProgressBar from "../progress-bar/ProgressBar";
import { getDailyTempArr } from "./utils/getDailyTempArr";
import { getShortWeekday } from "./utils/getShortWeekday";
import { getWeekTempArr } from "./utils/getWeekTempArr";

interface DailyForecastItemProp {
  data: WeatherData;
  item: ForecastObject;
  index: number;
  showModal: () => void;
  setCurrentIndex: (index: number) => void;
}

const DailyForecastItem = ({
  data,
  item,
  index,
  showModal,
  setCurrentIndex,
}: DailyForecastItemProp) => {
  const weekday = getShortWeekday(getDate(item?.date + "T00:00:00"));

  const weekTempArr = getWeekTempArr(data);
  const weekHigh = Math.max(...weekTempArr);
  const weekLow = Math.min(...weekTempArr);

  const dailyTempArr = getDailyTempArr(data, index);
  const dailyHigh = Math.max(...dailyTempArr);
  const dailyLow = Math.min(...dailyTempArr);

  return (
    <Pressable
      style={{
        borderTopWidth: 1,
        borderTopColor: colors.bgWhite(0.2),
      }}
      key={item?.date}
      className="flex-row items-center w-full py-4 mr-4 gap-x-8"
      onPress={() => {
        setCurrentIndex(index);
        showModal();
      }}
    >
      {/* Day + Weather Image */}
      <View
        className="flex-row justify-between items-center "
        style={{ flex: 40 }}
      >
        <DefaultText className="font-bold text-xl">
          {index === 0 ? "Today" : weekday}
        </DefaultText>

        <Image
          source={
            weatherKey[
              weatherPNG(item?.day.condition.text.toLowerCase() as WeatherType)
            ]
          }
          className="h-8 w-8"
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
            temperature={Math.round(dailyLow)}
            style={{ alignSelf: "flex-end", paddingRight: 5 }}
          />
        </View>

        {/* Temperature Bar */}
        <View style={{ flex: 50 }}>
          <ProgressBar
            weekHigh={weekHigh}
            weekLow={weekLow}
            dailyHigh={dailyHigh}
            dailyLow={dailyLow}
            currentTemperature={parseInt(data.current?.temp_c!)}
            index={index}
          />
        </View>

        {/* Daily High */}
        <View style={{ flex: 20 }}>
          <RoundedTemperature
            className="text-xl font-semibold "
            temperature={Math.round(dailyHigh)}
            style={{ alignSelf: "flex-end" }}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default DailyForecastItem;
