import { View, Text } from "react-native";
import React from "react";
import ModalTextBox from "../modal/ModalTextBox";
import ColoredBar from "../atoms/ColoredBar";
import { colors } from "@/assets/colors/colors";
import { getAQI } from "./utils/getAQI";
import { getAQIRating } from "./utils/getAQIRating";
import { useWeatherData } from "@/hooks/useWeatherData";
import { WeatherData } from "@/constants/constants";
import DescriptionText from "../modal/DescriptionText";

interface AirQualityModalDescriptionProps {
  cityName: string;
}

const AirQualityModalDescription = ({
  cityName,
}: AirQualityModalDescriptionProps) => {
  const data = useWeatherData();

  const AQI = getAQI(data[cityName]);
  const rating = getAQIRating(AQI);
  const gradientColors: readonly [string, string, ...string[]] = [
    "#00df72",
    "#f5e536",
    "#fc9003",
    "#f51458",
    "#ad02f6",
    "#82162c",
    "#82162c",
  ];
  return (
    <>
      <ModalTextBox title="Good" subTitle="Scale: United States (AQI)">
        <DescriptionText>
          Air quality index is {AQI}, which is better than yesterday at about
          this time.
        </DescriptionText>
        <ColoredBar
          cityName={cityName}
          index={AQI}
          maxIndex={500}
          label={"AQI"}
          colorsArr={gradientColors}
          locationsArr={[0.05, 0.2, 0.3, 0.4, 0.5, 0.8, 1]}
        />
      </ModalTextBox>

      <ModalTextBox title="Health Information">
        <DescriptionText>
          Air quality is satisfactory and poses little or no health risk.
        </DescriptionText>
      </ModalTextBox>

      <ModalTextBox title="Primary Pollutant" subTitle="Ozone (O)">
        <DescriptionText>
          Ozone is typically elevated due to traffic, fossil fuel combustion,
          and fires and can be transported far distances.
        </DescriptionText>
      </ModalTextBox>
    </>
  );
};

export default AirQualityModalDescription;
