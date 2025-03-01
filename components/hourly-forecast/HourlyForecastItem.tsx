import { weatherKey, WeatherType } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import React from "react";
import { Image, Pressable } from "react-native";
import DefaultText from "../atoms/DefaultText";
import RoundedTemperature from "../atoms/RoundedTemperature";
import { DailyStats } from "./utils/constants";

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
  return (
    <Pressable
      onPress={() => {
        showModal();
      }}
      onStartShouldSetResponder={() => true}
      className="flex justify-center items-center w-fit rounded-3xl pt-3 "
      style={{
        rowGap: 6,
        paddingLeft: index === 0 ? 0 : 13,
        paddingRight: index === dailyArr.length - 1 ? 0 : 13,
      }}
    >
      <DefaultText className="font-semibold">
        {index === 0 ? "Now" : hour?.time.split(" ").join("")}
      </DefaultText>

      <Image
        source={
          weatherKey[weatherPNG(hour?.condition.toLowerCase() as WeatherType)]
        }
        className="h-8 w-8"
      />

      <RoundedTemperature
        temperature={hour?.celsius}
        className="text-xl font-semibold"
      />
    </Pressable>
  );
};

export default HourlyForecastItem;
