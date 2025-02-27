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
import { getSunPhaseInfo } from "./utils/getSunPhaseInfo";
import SunPhaseDraggableTime from "./SunPhaseDraggableTime";
import SunPhaseInfo from "./SunPhaseInfo";
import SunPhaseHeader from "./SunPhaseHeader";

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
  const { location } = data[cityName];

  const { americanTime } = useSelector((state: RootState) => state.settings);

  const currentTime = getCurrentTime(location?.tz_id);

  const remainingTime = getRemainingTimeUntilNextPhase(
    currentTime,
    nextPhaseTime
  );

  const sunPhaseInfo = getSunPhaseInfo(data[cityName], americanTime);

  return (
    <View>
      <View className="px-4">
        <View className=" py-4 relative">
          <SunPhaseHeader
            data={data[cityName]}
            isActive={isActive}
            nextPhaseTime={nextPhaseTime}
            remainingTime={remainingTime}
          />

          <SunPhaseDraggableTime
            americanTime={americanTime}
            state={state}
            isActive={isActive}
          />
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
          style={{
            borderWidth: 1,
            borderColor: colors.lightGray,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <SunPhaseInfo sunPhaseInfo={sunPhaseInfo} />
        </View>
      </View>
    </View>
  );
};

export default SunPhaseModal;
