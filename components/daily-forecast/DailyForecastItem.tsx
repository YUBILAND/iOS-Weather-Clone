import { ForecastObject, WeatherData } from "@/constants/constants";
import { getDate } from "@/hooks/hooks";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import React, { MutableRefObject } from "react";
import { Image, Pressable, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import TemperatureBar from "../conditions/TemperatureBar";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getWeekArr } from "../utils/getWeekArr";
import { getShortWeekday } from "./utils/getShortWeekday";
import { getTemperature } from "@/hooks/useDisplayUnits";

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

  const weekTempArr = getWeekArr(data, "temp_c");
  const weekHigh = Math.max(...weekTempArr);
  const weekLow = Math.min(...weekTempArr);

  const dailyTempArr = getDayArr(data, index, "temp_c");
  const dailyHigh = Math.max(...dailyTempArr);
  const dailyLow = Math.min(...dailyTempArr);

  const windyCountArr = item.hour.filter((hour) => hour.wind_mph >= 15);
  const isWindyDay = windyCountArr.length > 12;

  return (
    <>
      {index !== 0 && <HorizontalLine />}
      <Pressable
        key={item?.date}
        className="flex-row items-center w-full mr-4 gap-x-8"
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
            //Weather image will always show day time weather so true
            source={weatherNameToImage(
              getWeatherName(item?.day.condition?.code),
              true
            )}
            className="h-8 w-8"
          />
        </View>

        {/* High and Low + Progress Bar */}
        <View style={{ flex: 60 }}>
          <TemperatureBar
            barWidth={100}
            weekHigh={weekHigh}
            weekLow={weekLow}
            tempHigh={Math.round(dailyHigh)}
            tempLow={Math.round(dailyLow)}
            currentTemperature={
              index === 0 ? getTemperature(data.current.temp_c) : undefined
            }
          />
        </View>
      </Pressable>
    </>
  );
};

export default React.memo(DailyForecastItem);
