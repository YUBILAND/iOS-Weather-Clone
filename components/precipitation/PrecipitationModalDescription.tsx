import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import ModalTextBox from "../modal/ModalTextBox";
import PrecipOption from "../modal/PrecipOption";
import DescriptionText from "../modal/DescriptionText";

interface PrecipitationModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const PrecipitationModalDescription = ({
  data,
  currentIndex,
}: PrecipitationModalDescriptionProps) => {
  const dailySummaryMessage = "We getting some light rain yall";
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Summary">
        <DescriptionText>{dailySummaryMessage}</DescriptionText>
      </ModalTextBox>

      <ModalTextBox title={"Options"}>
        <PrecipOption />
      </ModalTextBox>
    </View>
  );
};

export default PrecipitationModalDescription;
