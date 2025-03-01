import { View, Text, Pressable } from "react-native";
import React from "react";
import OpacityCard from "../atoms/OpacityCard";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import WindCardInfo from "./WindCardInfo";
import WindCardCompass from "./WindCardCompass";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

interface WindCardProps {
  cityName: string;
  showModal: () => void;
}

const WindCard = ({ cityName, showModal }: WindCardProps) => {
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
            <FontAwesome6 name="wind" color="white" size={20} />
            <DefaultText className="text-base uppercase font-semibold">
              Wind
            </DefaultText>
          </View>

          <View>
            <View className="flex-row items-center">
              <View className="flex-[0.6]">
                <WindCardInfo data={data[cityName]} />
              </View>

              <View className="flex-[0.4]">
                <WindCardCompass data={data[cityName]} />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default WindCard;
