import { View, Text, Image } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import HorizontalLine from "../atoms/HorizontalLine";
import { rotate } from "@shopify/react-native-skia";
import { WeatherData } from "@/constants/constants";
import MoonSVG from "./MoonSVG";

interface MoonPhaseCompassProps {
  data: WeatherData;
}

const MoonPhaseCompass = ({ data }: MoonPhaseCompassProps) => {
  //   const windDirection = getDegreesFromWindDirection(data.current.wind_dir);
  //   console.log(data.current.wind_dir);
  const rotationDegrees = (data.current.wind_degree + 90).toString() + "deg";

  return (
    <View className="items-end">
      <MoonSVG size={120} />
    </View>
  );
};

export default MoonPhaseCompass;
