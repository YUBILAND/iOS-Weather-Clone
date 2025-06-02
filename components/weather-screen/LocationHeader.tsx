import { getCurrentTemps } from "@/hooks/getCurrentTemps";
import { getLocationHeaderStyles } from "@/hooks/getLocationHeaderStyles";
import { useWeatherData } from "@/hooks/useWeatherData";
import React from "react";
import { View } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import HighsAndLows from "../atoms/HighsAndLows";
import LocationName from "../atoms/LocationName";
import MinimizedTemp from "../atoms/MinimizedTemp";
import RoundedTemperature from "../atoms/RoundedTemperature";
import WeatherName from "../atoms/WeatherName";
import { textShadowStyle } from "./utils/constants";
interface LocationHeaderProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
}
const LocationHeader = ({
  cityName,
  scrolledDownShared,
}: LocationHeaderProps) => {
  const data = useWeatherData();
  const { location, current } = data[cityName];

  const {
    highAndLowOpacityStyle,
    conditionOpacityStyle,
    tempOpacityStyle,
    minimizedTempOpacityStyle,
  } = getLocationHeaderStyles(scrolledDownShared);

  const { currentTemp, currentHigh, currentLow } = getCurrentTemps(cityName);

  return (
    <Animated.View className="mt-10 ">
      <View className="relative">
        <LocationName
          location={location}
          className="text-center text-5xl"
          style={textShadowStyle}
        />

        <View className="absolute top-full left-0 w-screen gap-y-2">
          <Animated.View style={tempOpacityStyle}>
            <RoundedTemperature
              temperature={currentTemp}
              className="text-center pl-5"
              style={{
                fontSize: 100,
                lineHeight: 100,
                marginBottom: -20,
                fontWeight: 200,
                ...textShadowStyle,
              }}
            />
          </Animated.View>

          <View>
            <Animated.View style={conditionOpacityStyle}>
              <WeatherName
                weatherName={current?.condition.text}
                className="text-center text-xl"
                style={textShadowStyle}
              />
            </Animated.View>

            <Animated.View style={highAndLowOpacityStyle}>
              <View className="flex-row gap-x-2 justify-center items-center ">
                <HighsAndLows
                  high={currentHigh}
                  low={currentLow}
                  textClasses="text-xl font-semibold"
                  style={textShadowStyle}
                />
              </View>
            </Animated.View>
          </View>
        </View>
      </View>

      <View className="relative">
        <Animated.View
          className="justify-center"
          style={minimizedTempOpacityStyle}
        >
          <MinimizedTemp
            currentTemp={currentTemp}
            currentCondition={current?.condition.text}
            viewTw="justify-center flex-row gap-4 mb-2"
            style={textShadowStyle}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default React.memo(LocationHeader);
