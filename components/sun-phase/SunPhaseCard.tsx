import { getCurrentTime, stringToTime } from "@/hooks/hooks";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import { useWeatherData } from "@/hooks/useWeatherData";
import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import CardBottomText from "../atoms/CardBottomText";
import CardStat from "../atoms/CardStat";
import CardTitle from "../atoms/CardTitle";
import OpacityCard from "../atoms/OpacityCard";
import SunPhaseGraph from "./SunPhaseGraph";
import { getNextPhaseTime } from "./utils/getNextPhaseTime";

Animated.addWhitelistedNativeProps({ value: true, source: true });

type SunPhaseCardProps = {
  cityName: string;
  graphHeight: number;
  showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

const SunPhaseCard = ({
  cityName,
  graphHeight,
  showModal,
  iconSize,
  collapseFromTopStyle,
}: SunPhaseCardProps) => {
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { sunPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const data = useWeatherData();
  const is12Hr = useIs12Hr();

  const { location } = data[cityName];

  const currentTime = useMemo(() => getCurrentTime(location?.tz_id), []);
  const nextPhaseTime = useMemo(
    () => getNextPhaseTime(data[cityName], currentTime),
    []
  );
  const nextNextPhaseTime = useMemo(
    () => getNextPhaseTime(data[cityName], nextPhaseTime),
    []
  );

  const nextSunPhase = data[cityName].current.is_day ? "Sunset" : "Sunrise";
  const nextNextSunPhase = data[cityName].current.is_day ? "Sunrise" : "Sunset";

  const domain = useMemo(() => ({ top: 1000, bottom: -800 }), []);
  return (
    <OpacityCard className="h-full">
      <Pressable onPress={showModal}>
        <View className="px-4 pb-2">
          <CardTitle
            title={nextSunPhase}
            icon={<FontAwesome name="sun-o" color="white" size={iconSize} />}
          />
        </View>

        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <View className="px-4">
              <CardStat stat={stringToTime(is12Hr, nextPhaseTime)} />
            </View>

            <SunPhaseGraph
              cityName={cityName}
              state={state}
              isActive={isActive}
              graphHeight={graphHeight}
              domain={domain}
              strokeWidth={4}
              removePress
            />
            <CardBottomText
              className="px-4"
              text={`${nextNextSunPhase}: ${stringToTime(
                is12Hr,
                nextNextPhaseTime
              )}`}
            />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(SunPhaseCard);
