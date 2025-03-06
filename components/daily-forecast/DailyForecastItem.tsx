import { colors } from "@/assets/colors/colors";
import {
  ForecastObject,
  WeatherData,
  weatherKey,
  WeatherType,
} from "@/constants/constants";
import { getDate } from "@/hooks/hooks";
import { weatherPNG } from "@/utils/exampleForecast";
import React, { MutableRefObject } from "react";
import { Image, Pressable, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import RoundedTemperature from "../atoms/RoundedTemperature";
import ProgressBar from "../progress-bar/ProgressBar";
import { getDailyTempArr } from "./utils/getDailyTempArr";
import { getShortWeekday } from "./utils/getShortWeekday";
import { getWeekTempArr } from "./utils/getWeekTempArr";
import TemperatureBar from "../conditions/TemperatureBar";

interface DailyForecastItemProp {
  data: WeatherData;
  item: ForecastObject;
  index: number;
  showModal: () => void;
  setCurrentIndex: (index: number) => void;
  openModalOnIndexRef: MutableRefObject<boolean>;
}

const DailyForecastItem = ({
  data,
  item,
  index,
  showModal,
  setCurrentIndex,
  openModalOnIndexRef,
}: DailyForecastItemProp) => {
  const weekday = getShortWeekday(getDate(item?.date + "T00:00:00"));

  const weekTempArr = getWeekTempArr(data);
  const weekHigh = Math.max(...weekTempArr);
  const weekLow = Math.min(...weekTempArr);

  const dailyTempArr = getDailyTempArr(data, index);
  const dailyHigh = Math.max(...dailyTempArr);
  const dailyLow = Math.min(...dailyTempArr);

  const windyCountArr = item.hour.filter((hour) => hour.wind_mph >= 15);
  const isWindyDay = windyCountArr.length > 12;

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
        openModalOnIndexRef.current = true;
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
              weatherPNG(
                isWindyDay
                  ? ("windy" as WeatherType)
                  : (item?.day.condition.text.toLowerCase() as WeatherType)
              )
            ]
          }
          className="h-8 w-8"
        />
      </View>

      {/* High and Low + Progress Bar */}
      <View style={{ flex: 60 }}>
        <TemperatureBar
          barWidth={100}
          weekHigh={weekHigh}
          weekLow={weekLow}
          tempHigh={dailyHigh}
          tempLow={dailyLow}
          currentTemperature={
            index === 0 ? parseFloat(data.current.temp_c) : undefined
          }
        />
      </View>
    </Pressable>
  );
};

export default DailyForecastItem;
