import React from "react";
import {
  Pressable,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import BarGraph from "./BarGraph";
import { useRainGraphData } from "./utils/useRainGraphData";

interface RainHourCardProps {
  cityName: string;
  iconSize: number;
  showModal?: () => void;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  title: React.ReactNode;
}

const RainHourCard = ({
  cityName,
  iconSize,
  showModal,
  collapseFromTopStyle,
  title,
}: RainHourCardProps) => {
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { minute: 0, mainBar: 0 },
  });

  const rainGraphData = useRainGraphData(cityName);

  const rainStoppingIndex = rainGraphData.findIndex(
    (item) => item.mainBar === 0
  );

  const rainTitle =
    rainStoppingIndex <= 10 ? "Rain Stopping" : "Rain Forecasted";

  const rainSubText =
    rainStoppingIndex !== -1
      ? // Rain is stopping within 60 mins
        `Rain is stopping in ${rainStoppingIndex} min.`
      : // Rain won't stop
        `Rain for the next hour`;

  return (
    <OpacityCard className="px-4">
      <Pressable className="gap-y-1" onPress={showModal}>
        {title}

        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <DefaultText
              style={{
                fontSize: 16,
                lineHeight: 16,
                fontWeight: 400,
                paddingBottom: 10,
              }}
            >
              {rainSubText}
            </DefaultText>

            <BarGraph
              cityName={cityName}
              state={state}
              isActive={isActive}
              graphData={rainGraphData}
              domainTop={4.5}
              graphHeight={80}
              cardMode
            />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default RainHourCard;
