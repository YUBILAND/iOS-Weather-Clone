import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import ModalOption from "../modal/ModalOption";
import ModalTextBox from "../modal/ModalTextBox";

interface PrecipitationModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const PrecipitationModalDescription = ({
  data,
  currentIndex,
}: PrecipitationModalDescriptionProps) => {
  const dailyOverviewMessage = "random message";
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Summary">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>

      <ModalOption />
    </View>
  );
};

export default PrecipitationModalDescription;
