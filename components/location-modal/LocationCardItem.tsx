import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import { getLocationCardData } from "./utils/getLocationCardData";
import { textShadowStyle } from "../weather-screen/utils/constants";

interface LocationCardItemProps {
  city: string;
  isEditingList: boolean;
}

const LocationCardItem = ({ city, isEditingList }: LocationCardItemProps) => {
  const {
    currentTemp,
    cityTime,
    currentWeatherCondition,
    currentHigh,
    currentLow,
  } = getLocationCardData(city);
  return (
    <>
      <View className="flex-row justify-between items-center flex-[50]">
        {/* City Info */}
        <View className={isEditingList ? "gap-y-1" : ""}>
          <DefaultText
            style={[{ fontSize: 20, fontWeight: 700 }, textShadowStyle]}
          >
            {city}
          </DefaultText>

          <DefaultText style={[{ fontWeight: 700 }, textShadowStyle]}>
            {cityTime}
          </DefaultText>
        </View>

        {/* Temps */}
        <DefaultText
          style={[{ fontWeight: 700 }, textShadowStyle]}
          className=" text-5xl"
        >
          {Math.round(currentTemp) + "°"}
        </DefaultText>
      </View>

      {/* Bottom Details */}
      {!isEditingList && (
        <View className="justify-end flex-[50]">
          <View className="flex-row justify-between w-full items-center">
            <DefaultText
              style={[{ fontWeight: 700 }, textShadowStyle]}
              className="text-sm"
            >
              {currentWeatherCondition}
            </DefaultText>
            <View className="flex-row w-24">
              <DefaultText
                style={[{ fontWeight: 700, flex: 5 }, textShadowStyle]}
                className="text-sm "
              >
                H:{Math.round(currentHigh) + "°"}
              </DefaultText>
              <DefaultText
                style={[{ fontWeight: 700, flex: 5 }, textShadowStyle]}
                className="text-sm"
              >
                L:{Math.round(currentLow) + "°"}
              </DefaultText>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default LocationCardItem;
