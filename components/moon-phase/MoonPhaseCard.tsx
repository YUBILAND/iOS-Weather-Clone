import { View, Text, Pressable } from "react-native";
import React from "react";
import OpacityCard from "../atoms/OpacityCard";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import MoonPhaseInfo from "./MoonPhaseInfo";
import MoonPhaseMoon from "./MoonPhaseMoon";
import { MoonIcon } from "react-native-heroicons/outline";
import CardTitle from "../atoms/CardTitle";
import MoonPhaseGraph from "./MoonPhaseGraph";
import { useChartPressState } from "victory-native";
import { MoonPhase } from "./utils/constants";
import { useWeatherData } from "@/hooks/useWeatherData";

interface MoonPhaseCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  userScrolledIndex: number;
  currentMoonPhase: MoonPhase;
  initialScrollIndex: number;
}

const MoonPhaseCard = ({
  cityName,
  showModal,
  iconSize,
  userScrolledIndex,
  currentMoonPhase,
  initialScrollIndex,
}: MoonPhaseCardProps) => {
  const data = useWeatherData();

  const { state } = useChartPressState({
    x: 0,
    y: { moonPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const actualCurrentMoonPhase =
    data[cityName].forecast.forecastday[0].astro.moon_phase;

  return (
    <OpacityCard className="px-4 gap-y-2">
      <Pressable
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title={actualCurrentMoonPhase}
          icon={<MoonIcon color="white" size={iconSize} />}
        />

        <View>
          <View className="flex-row items-center gap-x-4">
            <View className="flex-[0.6]">
              <MoonPhaseInfo data={data[cityName]} />
            </View>
            <View className="flex-[0.4] ">
              <MoonPhaseGraph
                cityName={cityName}
                state={state}
                graphHeight={250}
                userScrolledIndex={userScrolledIndex}
                currentMoonPhase={currentMoonPhase}
                initialScrollIndex={initialScrollIndex}
                scaleDown={130}
              />
            </View>

            {/* <View className="flex-[0.4]">
              <MoonPhaseMoon data={data[cityName]} />
            </View> */}
          </View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default MoonPhaseCard;
