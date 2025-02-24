import { colors } from "@/assets/colors/colors";
import {
  getChordLength,
  getCurrentTime,
  getRemainingTimeUntilNextPhase,
  militaryHour,
  removeZeroFromTimeString,
  stringToTime,
} from "@/hooks/hooks";
import { RootState } from "@/state/store";
import React, { useState } from "react";
import { Dimensions, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import SunPhaseGraph from "./SunPhaseGraph";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type SunPhaseModalProps = {
  cityName: string;
  nextPhaseTime: string;
};

const SunPhaseModal = ({ cityName, nextPhaseTime }: SunPhaseModalProps) => {
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { sunPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const { data } = useSelector((state: RootState) => state.weather);
  const { forecast, current, location } = data[cityName];

  const { americanTime } = useSelector((state: RootState) => state.settings);

  const animatedHour = useAnimatedProps(() => {
    const hourConversion = Math.floor((state.x.value.value * 60) / 60);
    const minuteConversion: number =
      (Math.round(state.x.value.value * 60 * 100) / 100) % 60;
    const hours =
      hourConversion.toString() +
      ":" +
      (minuteConversion < 10
        ? "0" + minuteConversion.toString()
        : minuteConversion.toString());

    const time = americanTime
      ? (parseInt(hours.split(":")[0]) % 13) +
        ":" +
        hours.split(":")[1].split(" ")[0] +
        (parseInt(hours.split(":")[0]) >= 12 ? " PM" : " AM")
      : hours;
    return {
      text: time,
      value: hours,
    };
  });

  const { width, height } = Dimensions.get("screen");

  const animatedStyle = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;

    const stopRight = americanTime ? 18 : 20;

    return {
      transform: [
        {
          translateX:
            xValue < 3
              ? (3 / 24) * width - 40
              : xValue > stopRight
              ? ((stopRight - 2) / 24) * width - 30
              : xPosition - 40,
        },
      ], // Translate X based on state.x
    };
  });

  const currentTime = getCurrentTime(location?.tz_id);

  const remainingTime = getRemainingTimeUntilNextPhase(
    currentTime,
    nextPhaseTime
  );

  const sunriseTime = forecast?.forecastday[0].astro.sunrise;
  const sunsetTime = forecast?.forecastday[0].astro.sunset;

  const sunlightTime = getChordLength(sunriseTime, sunsetTime, true);
  const sunlightHours = sunlightTime.toString().split(".")[0];
  const sunlightMinutes = parseInt(sunlightTime.toString().split(".")[1]);

  const sunPhaseInfo = {
    Dawn: stringToTime(
      americanTime,
      forecast?.forecastday[0].astro.sunrise,
      false,
      -28
    ),
    "Today's Sunrise": stringToTime(
      americanTime,
      forecast?.forecastday[0].astro.sunrise
    ),

    "Today's Sunset": stringToTime(
      americanTime,
      forecast?.forecastday[0].astro.sunset
    ),
    Dusk: stringToTime(
      americanTime,
      forecast?.forecastday[0].astro.sunset,
      false,
      28
    ),
    Sunlight:
      sunlightHours +
      " hrs " +
      (sunlightMinutes ? sunlightMinutes + " mins" : ""),
  };

  return (
    <View>
      <View className="px-4">
        <View className=" py-4 relative">
          <DefaultText
            className="text-3xl uppercase font-semibold"
            style={{ opacity: isActive ? 0 : 100 }}
          >
            {nextPhaseTime}
          </DefaultText>
          <DefaultText
            className="text-base font-semibold"
            style={{ opacity: isActive ? 0 : 100, color: colors.lightGray }}
          >
            {`${current?.is_day ? "Sunset" : "Sunrise"} in ${
              remainingTime.split(":")[0]
            } hrs ${remainingTime.split(":")[1]} mins`}
          </DefaultText>

          {/* Draggable Time */}
          <View
            className="absolute top-10 left-0"
            style={{ opacity: isActive ? 100 : 0 }}
          >
            <AnimatedTextInput
              editable={false}
              underlineColorAndroid={"transparent"}
              style={[
                {
                  fontSize: 32,
                  color: "white",
                  width: americanTime ? 150 : 100,
                  fontWeight: 800,
                },
                animatedStyle,
              ]}
              animatedProps={animatedHour}
            />
          </View>
        </View>

        <SunPhaseGraph
          cityName={cityName}
          state={state}
          isActive={isActive}
          graphHeight={250}
          strokeWidth={6}
          addBackground
          addLines
        />

        <View
          className=""
          style={{
            borderWidth: 1,
            borderColor: colors.lightGray,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          {Object.entries(sunPhaseInfo).map(([key, val], index) => {
            return (
              <React.Fragment key={key}>
                <View className="flex-row justify-between items-center">
                  <DefaultText className="px-4 py-2 text-lg font-semibold">
                    {key}
                  </DefaultText>
                  <DefaultText
                    className="px-4 py-2 text-lg font-semibold"
                    style={{ color: colors.bgWhite(0.6) }}
                  >
                    {val}
                  </DefaultText>
                </View>

                {index != Object.keys(sunPhaseInfo).length - 1 && (
                  <Text
                    className="w-full"
                    style={{
                      height: 0,
                      borderWidth: 1,
                      borderColor: colors.lightGray,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default SunPhaseModal;
