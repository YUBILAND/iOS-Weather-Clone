import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import ModalOption from "../modal/ModalOption";
import ModalTextBox from "../modal/ModalTextBox";
import PressureOption from "../modal/PressureOption";

interface AirPressureModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const AirPressureModalDescription = ({
  data,
  currentIndex,
}: AirPressureModalDescriptionProps) => {
  const summaryText = "random message";
  const airPressureText = `Atmospheric pressure, also known as air pressure or barometric pressure, is the pressure within the atmosphere of Earth. The standard atmosphere is a unit of pressure defined as 101,325 Pa, which is equivalent to 1,013.25 millibars, 760 mm Hg, 29.9212 inches Hg, or 14.696 psi.`;
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Overview">
        <DefaultText>{summaryText}</DefaultText>
      </ModalTextBox>

      <ModalTextBox title="About Air Pressure">
        <DefaultText>{airPressureText}</DefaultText>
      </ModalTextBox>

      <ModalTextBox title="Option">
        <PressureOption />
      </ModalTextBox>
    </View>
  );
};

export default AirPressureModalDescription;
