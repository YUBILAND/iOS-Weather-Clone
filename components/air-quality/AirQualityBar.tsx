import { View, Text } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import { LinearGradient } from "expo-linear-gradient";
import DefaultText from "../atoms/DefaultText";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

const AirQualityBar = ({
  cityName,
  index,
  label,
}: {
  cityName: string;
  index: number;
  label: "UV" | "AQI";
}) => {
  const progressWidth = label === "AQI" ? 320 : 140;
  const barWidth = label === "AQI" ? 320 : 140;

  const startPadding = 0;
  const leftGrayPercentage = 0;
  const rightGrayPercentage = 0;

  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const { location, forecast, current } = data[cityName];

  return (
    <View
      style={{
        width: progressWidth,
        height: 6,
        borderRadius: 20,
        backgroundColor: colors.bgWhite(0.2),
        paddingLeft: startPadding,
        position: "relative",
      }}
    >
      <LinearGradient
        colors={[
          "#00df72",
          "#f5e536",
          "#fc9003",
          "#f51458",
          "#ad02f6",
          "#82162c",
          "#82162c",
        ]} // Define your gradient colors
        locations={[0.05, 0.2, 0.3, 0.4, 0.5, 0.8, 1]}
        start={{ x: 0, y: 0 }} // Start point (left)
        end={{
          x: 1,
          y: 0,
        }} // End point (right)
        style={{
          width: barWidth,
          height: 6,
          borderRadius: 20,
        }} // Set the size
      />

      <DefaultText
        style={{
          marginLeft: index / 2,
        }}
        className="h-2 w-2 bg-white rounded-full absolute top-0 left-0"
      />
    </View>
  );
};

export default AirQualityBar;
