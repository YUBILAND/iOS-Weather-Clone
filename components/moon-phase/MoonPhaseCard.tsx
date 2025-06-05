import { useWeatherData } from "@/hooks/useWeatherData";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { MoonIcon } from "react-native-heroicons/outline";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import CardTitle from "../atoms/CardTitle";
import OpacityCard from "../atoms/OpacityCard";
import MoonPhaseGraph from "./MoonPhaseGraph";
import MoonPhaseInfo from "./MoonPhaseInfo";
import { MoonPhase } from "./utils/constants";

interface MoonPhaseCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  userScrolledIndex: number;
  currentMoonPhase: MoonPhase;
  initialScrollIndex: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const MoonPhaseCard = ({
  cityName,
  showModal,
  iconSize,
  userScrolledIndex,
  currentMoonPhase,
  initialScrollIndex,
  collapseFromTopStyle,
}: MoonPhaseCardProps) => {
  const data = useWeatherData();

  const { state } = useChartPressState({
    x: 0,
    y: { moonPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const actualCurrentMoonPhase =
    data[cityName].forecast.forecastday[0].astro.moon_phase;

  const MoonPhaseGraphProps = {
    cityName,
    state,
    userScrolledIndex,
    currentMoonPhase,
    initialScrollIndex,
  };

  const moonHeight = 130;

  const MoonPhaseCardContent = () => {
    return (
      <View
        className="flex-row items-center gap-x-4 "
        style={{ height: moonHeight }}
      >
        <View className="flex-[0.6]">
          <MoonPhaseInfo data={data[cityName]} />
        </View>
        <View className="flex-[0.4]">
          <MoonPhaseGraph
            {...MoonPhaseGraphProps}
            graphHeight={250}
            scaleDown={moonHeight}
          />
        </View>
      </View>
    );
  };

  return (
    <OpacityCard className="px-4 ">
      <Pressable onPress={showModal}>
        <CardTitle
          title={actualCurrentMoonPhase}
          icon={<MoonIcon color="white" size={iconSize} />}
        />

        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <MoonPhaseCardContent />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(MoonPhaseCard);
