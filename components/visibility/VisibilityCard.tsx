import { RootState } from "@/state/store";
import React from "react";
import { Pressable, View } from "react-native";
import { EyeIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import ColoredBar from "../atoms/ColoredBar";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { colors } from "@/assets/colors/colors";
import { FontAwesome } from "@expo/vector-icons";
import CardTitle from "../atoms/CardTitle";
import CardStat from "../atoms/CardStat";
import CardText from "../atoms/CardBottomText";
import CardBottomText from "../atoms/CardBottomText";

interface VisibilityCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
}

const VisibilityCard = ({
  cityName,
  showModal,
  iconSize,
}: VisibilityCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];

  const currentVisibility = Math.round(current.vis_miles).toString() + "mi";

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
          title={"Visibility"}
          icon={<EyeIcon size={iconSize} color={"white"} />}
        />

        <CardStat stat={currentVisibility} />

        <CardBottomText text={message} />
      </Pressable>
    </OpacityCard>
  );
};

export default VisibilityCard;
