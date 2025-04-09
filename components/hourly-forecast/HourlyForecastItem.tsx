import { colors } from "@/assets/colors/colors";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import React, { useCallback } from "react";
import { Image, Pressable, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import RoundedTemperature from "../atoms/RoundedTemperature";
import { DailyStats } from "./utils/constants";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import { dateStringToTime } from "@/hooks/hourlyConstants";
import { stringToTime } from "@/hooks/hooks";
import HourlyForecastItemTime from "./HourlyForecastItemTime";

interface HourlyForecastItemProps {
  hour: DailyStats;
  index: number;
  dailyArr: DailyStats[];
  showModal: () => void;
  temperature: string | number;
}

const HourlyForecastItem = ({
  hour,
  index,
  dailyArr,
  showModal,
  temperature,
}: HourlyForecastItemProps) => {
  const pressableHorizontalPadding = 8;
  const handlePress = useCallback(() => {
    showModal();
  }, [showModal]);
  return (
    <Pressable
      onPress={handlePress}
      onStartShouldSetResponder={() => true}
      className="flex justify-center items-center w-fit rounded-3xl pt-3 "
      style={{
        rowGap: 6,
        paddingLeft: index === 0 ? 0 : pressableHorizontalPadding,
        paddingRight:
          index === dailyArr.length - 1 ? 0 : pressableHorizontalPadding,
      }}
    >
      <HourlyForecastItemTime hour={hour} index={index} />

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
        temperature={temperature}
        className="text-xl font-semibold"
        style={{ fontSize: 20 }}
      />
    </Pressable>
  );
};

export default React.memo(HourlyForecastItem);
