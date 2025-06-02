import { getTemperature } from "@/hooks/useDisplayUnits";
import { RootState } from "@/state/store";
import { Octicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { useSelector } from "react-redux";
import CardBottomText from "../atoms/CardBottomText";
import CardStat from "../atoms/CardStat";
import CardTitle from "../atoms/CardTitle";
import OpacityCard from "../atoms/OpacityCard";
import TodayAndAverage from "./TodayAndAverage";
import { getAverageData } from "./utils/getAverageData";

interface AveragesCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const AveragesCard = ({
  cityName,
  showModal,
  iconSize,
  collapseFromTopStyle,
}: AveragesCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

  const { currentTemperature, averageHigh, tempFromAverage } = getAverageData(
    data[cityName]
  );
  const tempSign = currentTemperature >= averageHigh ? "+" : "-";
  const currentHigh = getTemperature(
    data[cityName].forecast.forecastday[0].day.maxtemp_c
  );

  const fromAverageText =
    (tempSign === "+" ? "above " : "from ") + "average daily high";

  return (
    <OpacityCard>
      <Pressable
        className="px-4 gap-y-2 h-full"
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title={"Averages"}
          icon={<Octicons name="graph" size={iconSize} color={"white"} />}
        />

        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle} className="gap-y-4">
            <View className="w-[60%]">
              <CardStat stat={tempSign + tempFromAverage + "°"} />
              <CardBottomText text={fromAverageText} />
            </View>

            <TodayAndAverage
              currentHigh={currentHigh}
              averageHigh={averageHigh}
            />
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(AveragesCard);
