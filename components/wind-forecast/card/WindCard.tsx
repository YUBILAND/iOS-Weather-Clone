import { View, Text, Pressable } from "react-native";
import React from "react";
import OpacityCard from "../../atoms/OpacityCard";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import DefaultText from "../../atoms/DefaultText";
import HorizontalLine from "../../atoms/HorizontalLine";
import WindCardInfo from "./WindCardInfo";
import WindCardCompass from "./WindCardCompass";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import CardTitle from "../../atoms/CardTitle";
import WindCardContent from "./WindCardContent";

interface WindCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
}

const WindCard = ({ cityName, showModal, iconSize }: WindCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

  return (
    <OpacityCard className="px-4 gap-y-2">
      <Pressable
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title="Wind"
          icon={<FontAwesome6 name="wind" color="white" size={iconSize} />}
        />

        <WindCardContent cityName={cityName} />
      </Pressable>
    </OpacityCard>
  );
};

export default WindCard;
