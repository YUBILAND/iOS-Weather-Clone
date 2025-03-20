import { weatherKey, WeatherType } from "@/constants/constants";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import React from "react";
import { Image, Pressable, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import RoundedTemperature from "../atoms/RoundedTemperature";
import { DailyStats } from "./utils/constants";
import { colors } from "@/assets/colors/colors";

interface HourlyForecastItemProps {
  hour: DailyStats;
  index: number;
  dailyArr: DailyStats[];
  showModal: () => void;
}

const HourlyForecastItem = ({
  hour,
  index,
  dailyArr,
  showModal,
}: HourlyForecastItemProps) => {
  const pressableHorizontalPadding = 8;
  return (
    <Pressable
      onPress={() => {
        showModal();
      }}
      onStartShouldSetResponder={() => true}
      className="flex justify-center items-center w-fit rounded-3xl pt-3 "
      style={{
        rowGap: 6,
        paddingLeft: index === 0 ? 0 : pressableHorizontalPadding,
        paddingRight:
          index === dailyArr.length - 1 ? 0 : pressableHorizontalPadding,
      }}
    >
      <DefaultText style={{ fontSize: 15, fontWeight: 600 }}>
        {index === 0 ? "Now" : hour?.time.split(" ").join("")}
      </DefaultText>

      <View className=" items-center h-10 w-12 justify-center">
        <Image
          source={weatherNameToImage(getWeatherName(hour?.code), hour?.is_day)}
          className="h-7 w-7"
        />
        {index !== 0 && hour?.chance_of_rain ? (
          <DefaultText
            style={{ color: colors.bgBlue(1), fontWeight: 600, fontSize: 12 }}
          >
            {hour.chance_of_rain + "%"}
          </DefaultText>
        ) : null}
      </View>

      <RoundedTemperature
        temperature={hour?.celsius}
        className="text-xl font-semibold"
        style={{ fontSize: 20 }}
      />
    </Pressable>
  );
};

export default HourlyForecastItem;
