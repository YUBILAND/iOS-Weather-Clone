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
import CardTitle from "../atoms/CardTitle";
import CardStat from "../atoms/CardStat";
import CardBottomText from "../atoms/CardBottomText";

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
        <CardTitle
          title={"Wind Chill"}
          icon={
            <FontAwesome
              name="thermometer-empty"
              color={"white"}
              size={iconSize}
            />
          }
        />

        <CardStat stat={windChillTemp} />

        <CardBottomText text={message} />
      </Pressable>
    </OpacityCard>
  );
};

export default WindChillCard;
