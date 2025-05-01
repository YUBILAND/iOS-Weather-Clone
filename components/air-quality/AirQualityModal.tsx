import { useOtherUnits } from "@/hooks/useOtherUnits";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import AirQualityModalDescription from "./AirQualityModalDescription";

interface AirQualityModalProps {
  cityName: string;
}
const AirQualityModal = ({ cityName }: AirQualityModalProps) => {
  const pressureUnit = useOtherUnits()["pressure"];

  return (
    <>
      <View className=" w-full h-80 bg-red-400">
        <DefaultText>Map Component should go here</DefaultText>
      </View>

      <AirQualityModalDescription cityName={cityName} />
    </>
  );
};

export default AirQualityModal;
