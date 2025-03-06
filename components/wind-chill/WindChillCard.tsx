import { RootState } from "@/state/store";
import React from "react";
import { Pressable, View } from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import ColoredBar from "../atoms/ColoredBar";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { colors } from "@/assets/colors/colors";
import { FontAwesome } from "@expo/vector-icons";

interface WindChillCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
}

const WindChillCard = ({
  cityName,
  showModal,
  iconSize,
}: WindChillCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];

  const windChillTemp = Math.round(current.windchill_c).toString() + "°";

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
          <FontAwesome
            name="thermometer-empty"
            color={"white"}
            size={iconSize}
          />
          <DefaultText className="text-base uppercase font-semibold">
            Wind Chill
          </DefaultText>
        </View>
        <DefaultText
          className="font-semibold"
          style={{ fontSize: 30, lineHeight: 30 }}
        >
          {windChillTemp}
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

export default WindChillCard;
