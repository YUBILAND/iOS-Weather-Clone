import {
  getCurrentTime,
  getRemainingTimeUntilNextPhase,
  militaryHour,
  stringToTime,
} from "@/hooks/hooks";
import { RootState } from "@/state/store";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import ModalContainer from "../modal/ModalContainer";
import SunPhaseGraph from "./SunPhaseGraph";
import SunPhaseModal from "./SunPhaseModal";
import { getNextPhaseTime } from "./utils/getNextPhaseTime";
import CardTitle from "../atoms/CardTitle";
import CardBottomText from "../atoms/CardBottomText";
import CardStat from "../atoms/CardStat";
import { useWeatherData } from "@/hooks/useWeatherData";

Animated.addWhitelistedNativeProps({ value: true, source: true });

type SunPhaseCardProps = {
  cityName: string;
  graphHeight: number;
  showModal: () => void;
  iconSize: number;
};

const SunPhaseCard = ({
  cityName,
  graphHeight,
  showModal,
  iconSize,
}: SunPhaseCardProps) => {
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { sunPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const data = useWeatherData();
  const { location } = data[cityName];

  const { americanTime } = useSelector((state: RootState) => state.settings);

  const currentTime = getCurrentTime(location?.tz_id);
  const nextPhaseTime = getNextPhaseTime(
    data[cityName],
    currentTime,
    americanTime
  );

  const nextNextPhaseTime = getNextPhaseTime(
    data[cityName],
    nextPhaseTime,
    americanTime
  );

  // const remainingTime = getRemainingTimeUntilNextPhase(
  //   currentTime,
  //   nextPhaseTime
  // );

  const nextSunPhase = data[cityName].current.is_day ? "Sunset" : "Sunrise";

  const nextNextSunPhase = data[cityName].current.is_day ? "Sunrise" : "Sunset";

  return (
    <OpacityCard className="h-full">
      <Pressable
        onPress={() => {
          showModal();
        }}
      >
        <View className="px-4 gap-y-2">
          <CardTitle
            title={nextSunPhase}
            icon={<FontAwesome name="sun-o" color="white" size={iconSize} />}
          />
          <CardStat stat={nextPhaseTime} />
        </View>

        <SunPhaseGraph
          cityName={cityName}
          state={state}
          isActive={isActive}
          graphHeight={graphHeight}
          domain={{ top: 800, bottom: -800 }}
          strokeWidth={4}
          removePress
        />
        <CardBottomText
          className="px-4"
          // text={`${nextSunPhase}: ${remainingTime.split(":")[0]} hrs ${
          //   remainingTime.split(":")[1]
          // } mins`}
          text={`${nextNextSunPhase}: ${nextNextPhaseTime}`}
        />
      </Pressable>
    </OpacityCard>
  );
};

export default SunPhaseCard;
