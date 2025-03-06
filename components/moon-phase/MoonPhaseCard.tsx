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

interface MoonPhaseCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
}

const MoonPhaseCard = ({
  cityName,
  showModal,
  iconSize,
}: MoonPhaseCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

  return (
    <OpacityCard className="">
      <Pressable
        onPress={() => {
          showModal();
        }}
      >
        <View className="px-4 gap-y-2">
          <View className="flex-row items-center gap-x-2 opacity-40">
            <MoonIcon color="white" size={iconSize} />
            <DefaultText className="text-base uppercase font-semibold">
              Moon Phase
            </DefaultText>
          </View>

          <View>
            <View className="flex-row items-center">
              <View className="flex-[0.6]">
                <MoonPhaseInfo data={data[cityName]} />
              </View>

              <View className="flex-[0.4]">
                <MoonPhaseMoon data={data[cityName]} />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default MoonPhaseCard;
