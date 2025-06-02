import { View, Text } from "react-native";
import React from "react";
import { SelectModal } from "./utils/modalConstants";
import { WeatherData } from "@/constants/constants";
import UVModalDescription from "../uv-index/UVModalDescription";
import ConditionsModalDescription from "../conditions/ConditionsModalDescription";
import WindChillModalDescription from "../wind-chill/WindChillModalDescription";
import PrecipitationModalDescription from "../precipitation/PrecipitationModalDescription";
import VisibilityModalDescription from "../visibility/VisibilityModalDescription";
import HumidityModalDescription from "../humidity/HumidityModalDescription";
import AirPressureModalDescription from "../air-pressure/AirPressureModalDescription";
import WindModalDescription from "../wind-forecast/WindModalDescription";
import AirQualityModalDescription from "../air-quality/AirQualityModalDescription";

interface ModalDescriptionsProps {
  data: WeatherData;
  currentIndex: number;
  selectedModal: SelectModal;
}

const ModalDescriptions = ({
  data,
  currentIndex,
  selectedModal,
}: ModalDescriptionsProps) => {
  return (
    <>
      {selectedModal === "uv" ? (
        <UVModalDescription data={data} currentIndex={currentIndex} />
      ) : selectedModal === "conditions" ? (
        <ConditionsModalDescription data={data} currentIndex={currentIndex} />
      ) : selectedModal === "feelsLike" ? (
        <WindChillModalDescription data={data} currentIndex={currentIndex} />
      ) : selectedModal === "precipitation" ? (
        <PrecipitationModalDescription
          data={data}
          currentIndex={currentIndex}
        />
      ) : selectedModal === "wind" ? (
        <WindModalDescription data={data} currentIndex={currentIndex} />
      ) : selectedModal === "visibility" ? (
        <VisibilityModalDescription data={data} currentIndex={currentIndex} />
      ) : selectedModal === "humidity" ? (
        <HumidityModalDescription data={data} currentIndex={currentIndex} />
      ) : selectedModal === "airPressure" ? (
        <AirPressureModalDescription data={data} currentIndex={currentIndex} />
      ) : (
        <View></View>
      )}
    </>
  );
};

export default React.memo(ModalDescriptions);
