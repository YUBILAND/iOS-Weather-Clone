import { RootState } from "@/state/store";
import React from "react";
import { Pressable, View } from "react-native";
import { EyeIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import ColoredBar from "../atoms/ColoredBar";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { colors } from "@/assets/colors/colors";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

interface HumidityCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
}

const HumidityCard = ({ cityName, showModal, iconSize }: HumidityCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];

  const currentHumidity = Math.round(current.humidity).toString() + "%";

  const message = "random message";

  return (
    <OpacityCard>
      <Pressable
        className="px-4 gap-y-2 h-full"
        onPress={() => {
          showModal();
        }}
      >
        <View className="flex-row items-center  gap-x-2 opacity-40">
          <FontAwesome6 name="droplet" size={iconSize} color={"white"} />
          <DefaultText className="text-base uppercase font-semibold">
            Humidity
          </DefaultText>
        </View>
        <DefaultText
          className="font-semibold"
          style={{ fontSize: 30, lineHeight: 30 }}
        >
          {currentHumidity}
        </DefaultText>
        <DefaultText
          style={{ fontSize: 14, lineHeight: 14, color: colors.lightGray }}
        >
          {message}
        </DefaultText>
      </Pressable>
    </OpacityCard>
  );
};

export default HumidityCard;
