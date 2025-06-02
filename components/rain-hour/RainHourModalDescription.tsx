import { WeatherData } from "@/constants/constants";
import React, { useMemo } from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import ModalTextBox from "../modal/ModalTextBox";
import PrecipOption from "../modal/PrecipOption";
import DescriptionText from "../modal/DescriptionText";
import RainMapComponent from "../rain-map/RainMapComponent";
import { useWeatherData } from "@/hooks/useWeatherData";
import ModalBoxTitle from "../modal/ModalBoxTitle";

interface RainHourModalDescriptionProps {
  cityName: string;
}

const RainHourModalDescription = ({
  cityName,
}: RainHourModalDescriptionProps) => {
  const data = useWeatherData();
  const { location } = data[cityName];

  const ZOOM_LEVEL = 4;

  const initialRegion = useMemo(
    () => ({
      latitude: location.lat,
      longitude: location.lon,
      latitudeDelta: 0.6 * ZOOM_LEVEL,
      longitudeDelta: 0.3 * ZOOM_LEVEL,
    }),
    []
  );

  const forecastMessage =
    "Rain for the next hour. Rainy conditions tonight, continuing through the morning.";

  return (
    <View className="px-4">
      <ModalTextBox title="Forecast">
        <DescriptionText>{forecastMessage}</DescriptionText>
      </ModalTextBox>

      <ModalBoxTitle title={"Precipitation Map"} />

      <View
        className="w-full"
        style={{ height: 400, borderRadius: 10, overflow: "hidden" }}
      >
        <RainMapComponent
          cityName={cityName}
          initialRegion={initialRegion}
          disableScroll
        />
      </View>
    </View>
  );
};

export default RainHourModalDescription;
